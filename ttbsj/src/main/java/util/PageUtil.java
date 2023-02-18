package util;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


import pageModel.EasyUIGridObj;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;

import util.StringUtil;
import exception.SysException;

public class PageUtil {
	public static Map _transPagging(Map paramMap) throws SysException{
		Map newParaMap = new HashMap();
		try {
			int start = Integer.parseInt(((String[]) paramMap.get("start"))[0]);
			int length = Integer.parseInt(((String[]) paramMap.get("length"))[0]);
			int orderCol = Integer.parseInt(((String[]) paramMap.get("order[0][column]"))[0]);//按哪里排序
			String direction = ((String[]) paramMap.get("order[0][dir]"))[0];
			newParaMap.put("start", start);
			newParaMap.put("length", length);
			newParaMap.put("orderCol", orderCol);
			newParaMap.put("direction", direction);
			/*paramMap.remove("start");
			paramMap.remove("length");*/
		} catch (Exception e) {
			System.out.println(e);
			throw new SysException("页码参数有误.");
		}
		return newParaMap;
	}
	public static EasyUIGridObj searchByPage(Object object, Map paramMap, String method) throws SysException {
		int pageNum = 0;
		int pageSize = 0;
		EasyUIGridObj easyUIGridObj = new EasyUIGridObj();
		try {
			pageNum = Integer.parseInt((String) paramMap.get("page"));
			pageSize = Integer.parseInt((String) paramMap.get("rows"));
		} catch (Exception e) {
			throw new SysException("分页参数格式不正确.");
		}
		String sort = (String) paramMap.get("sort");
		String order = (String) paramMap.get("order");
		if (!StringUtil.isEmpty(sort) && !StringUtil.isEmpty(order))
			if (order.toUpperCase().equals("DESC") || order.toUpperCase().equals("ASC")) 
					PageHelper.orderBy(StringUtil.stringFilter(sort) + " " + order);
			else System.out.println("分页参数不合法，已自动忽略");
		Page page = PageHelper.startPage(pageNum, pageSize);
		
		//java反射机制，动态调用方法
		try {
			Method targetMethod = object.getClass().getMethod(method, Map.class);//获取对象相应方法
			List<Map> list = (List<Map>) targetMethod.invoke(object, paramMap);//调用相应方法
		} catch (NoSuchMethodException e) {
			e.printStackTrace();
		} catch (SecurityException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (IllegalArgumentException e) {
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			e.printStackTrace();
		}
		
		/*customBlogMapper.searchMyRecBlogs(paramMap);*/
		//这句该怎么封装？？
		if(page.getTotal() > (pageNum - 1) * pageSize) {
			easyUIGridObj.setRows(page.getResult());
			easyUIGridObj.setTotal(page.getTotal());
		} else {
			easyUIGridObj.setRows(null);
			easyUIGridObj.setTotal(page.getTotal());
		}
		
		return easyUIGridObj;
	}
}
