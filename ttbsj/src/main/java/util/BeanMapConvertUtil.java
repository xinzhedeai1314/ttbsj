package util;


import exception.SysException;

import java.beans.BeanInfo;
import java.beans.IntrospectionException;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
/**   
 *
 * @ClassName BeanMapConvertUtil
 * @Description JavaBean转Map、Map转JavaBean工具类.慎用
 * Copyright (c) 2014 by NS Soft. 
 * @author xuliguo   
 * @date 2015年1月29日 上午10:54:05    
 * @version V1.0      
 *    
 */
@SuppressWarnings({"rawtypes"})
public class BeanMapConvertUtil {
	
	/**
     * 将一个 Map 对象转化为一个 JavaBean
     * @param clazz 要转化的类型
     * @param map 包含属性值的 map
     * @return 转化出来的 JavaBean 对象
	 * @throws SysException 
     * @throws IntrospectionException 如果分析类属性失败
     * @throws IllegalAccessException 如果实例化 JavaBean 失败
     * @throws InstantiationException 如果实例化 JavaBean 失败
     * @throws InvocationTargetException 如果调用属性的 setter 方法失败
     */
    public static <T> T toBean(Class<T> clazz, Map map) throws SysException {
        T obj = null;
        try {
            BeanInfo beanInfo = null;
			try {
				beanInfo = Introspector.getBeanInfo(clazz);
			} catch (IntrospectionException e1) {
				throw new SysException("调用map转换为bean的方法时抛出异常。");
			}
			// 创建 JavaBean 对象
            obj = clazz.newInstance(); 
            // 给 JavaBean 对象的属性赋值
            PropertyDescriptor[] propertyDescriptors = beanInfo.getPropertyDescriptors();
            for (int i = 0; i < propertyDescriptors.length; i++) {
                PropertyDescriptor descriptor = propertyDescriptors[i];
                String propertyName = descriptor.getName();
                Class propertyType = descriptor.getPropertyType();
                
                if (map.containsKey(propertyName)) {
                    Object value = map.get(propertyName);
//                    if ("".equals(value)) {
//                        value = null;
//                    }
                    
                    if (propertyType.equals(Date.class)) {
                 		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                 		try {
                 				if (StringUtil.isEmpty((String) value)){
                 					value = new Date();
                 				}else{
                 					if(((String)value).length() == 10){
                 						df = new SimpleDateFormat("yyyy-MM-dd");
                 						value = df.parse((String)value);
                 					}else {
                 						value = df.parse((String)value);
									}
                 				} 
							} catch (ParseException e) {
								e.printStackTrace();
								//value = new Date();
								value = null;
							}
                    } else if (propertyType.equals(Integer.class)) {
                 		try {
                 			if (!(value instanceof Number)) {
                 				if (StringUtil.isEmpty((String) value))
                     				value = 0;
                     			else value = Integer.parseInt((String) value);
                 			}
						} catch (Exception e) {
							value = 0;
						}
                    } else if (propertyType.equals(Byte.class)) {
                    		try {
                 			if (StringUtil.isEmpty((String) value))
                 				value = 0;
                 			else value = Byte.parseByte((String) value);
						} catch (Exception e) {
							value = 0;
						}
                    } else if (propertyType.equals(BigDecimal.class)) {
                    		try {
                    			if (!(value instanceof Number)) {
                    				if (StringUtil.isEmpty((String) value))
                     				value = 0;
                     			else value = new BigDecimal((String)value);
                    			}
						} catch (Exception e) {
							value = new BigDecimal(0);
						}
                    } else if (propertyType.equals(int.class)) {
                    		try {
                    			if (StringUtil.isEmpty((String) value))
                     				value = 0;
                    			else value = Integer.parseInt((String)value);
						} catch (Exception e) {
							value = 0;
						}
                    } else if (propertyType.equals(String.class)) {
                		try {
                			if (!StringUtil.isEmpty((String) value))
                 				value = ((String)value).replaceAll("\r|\n", "");;
						} catch (Exception e) {
							value = null;
						}          
                    }
                    
                    	Object[] args = new Object[1];
                    args[0] = value;
                    try {
                        descriptor.getWriteMethod().invoke(obj, args);
                    } catch (InvocationTargetException e) {
                    		System.out.println("字段[" + propertyName + "],值为[" + value + "],要映射的类型为[" + propertyType +"] 映射失败." + e);
                    } catch (Exception e) {
						System.out.println(e);
					}
                }
            }
        } catch (IllegalAccessException e) {
        		System.out.println("实例化 JavaBean 失败");
        } catch (IllegalArgumentException e) {
        		System.out.println("映射错误");
        } catch (InstantiationException e) {
        		System.out.println("实例化 JavaBean 失败");
        }
        /*ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        Set<ConstraintViolation<T>> constraintViolations = validator.validate(obj);
        int errorCnt = 0;
        StringBuffer errorMsg = new StringBuffer(64);
        for (ConstraintViolation<T> constraintViolation : constraintViolations) {
        		errorCnt++;
        		errorMsg.append(constraintViolation.getMessage());
        		//errorMsg += constraintViolation.getMessage();
		}
        //System.out.println("errorCnt:" + errorCnt);
        if (errorCnt != 0) {
        		throw new ParamException(errorMsg.toString());
        }*/
        return obj;
    }
 
    /**
     * 将一个 JavaBean 对象转化为一个 Map
     * @param bean 要转化的JavaBean 对象
     * @return 转化出来的 Map 对象
     * @throws IntrospectionException 如果分析类属性失败
     * @throws IllegalAccessException 如果实例化 JavaBean 失败
     * @throws InvocationTargetException 如果调用属性的 setter 方法失败
     */
    public static Map toMap(Object bean) {
        Class<? extends Object> clazz = bean.getClass();
        Map<Object, Object> returnMap = new HashMap<Object, Object>();
        BeanInfo beanInfo = null;
        try {
            beanInfo = Introspector.getBeanInfo(clazz);
            PropertyDescriptor[] propertyDescriptors = beanInfo.getPropertyDescriptors();
            for (int i = 0; i < propertyDescriptors.length; i++) {
                PropertyDescriptor descriptor = propertyDescriptors[i];
                String propertyName = descriptor.getName();
                if (!propertyName.equals("class")) {
                    Method readMethod = descriptor.getReadMethod();
                    Object result = null;
                    result = readMethod.invoke(bean, new Object[0]);
                    if (null != propertyName) {
                        propertyName = propertyName.toString();
                    }
                    if (null != result) {
                        result = result.toString();
                    }
                    returnMap.put(propertyName, result);
                }
            }
        } catch (IntrospectionException e) {
        		System.out.println("分析类属性失败");
        } catch (IllegalAccessException e) {
        		System.out.println("实例化 JavaBean 失败");
        } catch (IllegalArgumentException e) {
        		System.out.println("映射错误");
        } catch (InvocationTargetException e) {
        		System.out.println("调用属性的 setter 方法失败");
        }
        return returnMap;
    }
}
