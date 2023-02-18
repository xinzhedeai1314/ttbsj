package util;

import org.apache.commons.io.FilenameUtils;
import org.springframework.util.LinkedCaseInsensitiveMap;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import exception.SysException;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


/**
 *
 * @ClassName RequestUtil
 * @Description Copyright (c) 2014 by NS Soft.
 * @author xuliguo
 * @date 2014年12月12日 下午8:08:55
 * @version V1.0
 * 
 */
@SuppressWarnings({ "unchecked", "rawtypes", "deprecation" })
public class RequestUtil {

	
	public static Map<Object, Object> getParamMap(HttpServletRequest request) {
		Map<Object, Object> paramMap = new HashMap<Object, Object>();
		Enumeration<String> paramNames = request.getParameterNames();
		for (Enumeration<String> e = paramNames; e.hasMoreElements();) {
			Object key = e.nextElement();
			Object value = request.getParameter((String) key);
			if (value != null && !value.equals(""))
				paramMap.put(key, value);
		}
		return paramMap;
	}


	public static String getIpAddr(HttpServletRequest request) {
		String ip = request.getHeader("x-forwarded-for");
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("WL-Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getRemoteAddr();
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = "无法获取IP地址";
		}
		if (ip.equals("0:0:0:0:0:0:0:1"))
			ip = "localhost";
		return ip;
	}

	public static void decodeParams(Map paramMap) throws Exception {
		Set<String> keySet = paramMap.keySet();
		Iterator<String> itr = keySet.iterator();
		while (itr.hasNext()) {
			String key = itr.next();
			String value = (String) paramMap.get(key);
			try {
				paramMap.put(key, new String(value.getBytes("iso-8859-1"), "utf-8"));
			} catch (UnsupportedEncodingException e) {
				System.out.println(e);
				throw new Exception("编码转换错误:无法将" + key + "->" + value + "转成utf-8");
			}
		}
	}

	public static Cookie getCookieByName(HttpServletRequest request, String name) {
		Map<String, Cookie> cookieMap = ReadCookieMap(request);
		if (cookieMap.containsKey(name)) {
			Cookie cookie = cookieMap.get(name);
			return cookie;
		} else {
			return null;
		}
	}

	private static Map<String, Cookie> ReadCookieMap(HttpServletRequest request) {
		Map<String, Cookie> cookieMap = new HashMap<String, Cookie>();
		Cookie[] cookies = request.getCookies();
		if (null != cookies) {
			for (Cookie cookie : cookies) {
				cookieMap.put(cookie.getName(), cookie);
			}
		}
		return cookieMap;
	}

	public static void deleteCookie (String Cookiename, String path,
			HttpServletResponse response) {
		Cookie cookie = new Cookie(Cookiename, null);
		cookie.setPath(path);
		cookie.setMaxAge(0);
		response.addCookie(cookie);
	}
	
	public static boolean isAjaxRequest (HttpServletRequest req) {
		String requestType = req.getHeader("X-Requested-With");
        if (requestType != null && requestType.equals("XMLHttpRequest")) {
            return true;
        } else {
            return false;
        }
	}
	
	public static List uploadFilesToList(HttpServletRequest req, String splitChar) throws Exception {
		List resulList = new ArrayList();
		MultipartHttpServletRequest multiReq = (MultipartHttpServletRequest) req;
		Iterator<String> files = multiReq.getFileNames();  
		while (files.hasNext()) {
			String fileName = files.next();
			MultipartFile multiFile = multiReq.getFile(fileName);
			String extensionName = FilenameUtils.getExtension(multiFile.getOriginalFilename()).toUpperCase();
			if (!multiFile.isEmpty() && extensionName.equals("XLS") || extensionName.equals("XLSX")) {
				try {
					List fileData = POIUtil.exportListFromExcel(multiFile.getInputStream(), extensionName, 0);
					resulList.addAll(fileData);
				} catch (IOException e) {
					throw new Exception();
				}
			} else if (extensionName.equals("TXT") || extensionName.equals("CSV")) {
				resulList.add(Arrays.asList(new String[] {"1", "2", "3"}));
				BufferedReader br = null;
				try {
					br = new BufferedReader(new InputStreamReader(multiFile.getInputStream(), "UTF-8"));
				} catch (IOException e) {
					throw new Exception();
				}
				String line = "";
				try {
					while ((line = br.readLine()) != null) {
						String[] elements = line.split(splitChar);
						resulList.add(Arrays.asList(elements));
					}
				} catch (IOException e) {
					throw new Exception();
				}
			}
			//存储临时文件
			String originName = multiFile.getOriginalFilename();
			try {
	    			originName = new String (originName.getBytes("iso-8859-1"), "UTF-8");
	    			originName = URLDecoder.decode(originName, "UTF-8");  
	    			originName = StringUtil.converterToSpell(originName);
	    			originName = StringUtil.removeCommaChar(originName);
			} catch (UnsupportedEncodingException e) {
				System.out.println(e);
				throw new Exception("编码错误");
			}
			
    			String file_extension = (originName.substring(originName.lastIndexOf(".") + 1)).toLowerCase();
    		
    			if (StringUtil.isEmpty(file_extension)) throw new Exception("请检查文件后缀名是否正确");
    		
	    		String file_nm = originName.substring(0, originName.lastIndexOf("."));	
	    		String file_id = "";
	    		if (file_nm.length() > 25)
	    			file_nm  = file_nm.substring(0, 25);
	    		file_id =  DateUtil.getTodayTS("yyMMddHHmmssSSS") + "_" + file_nm;
	    		String file_path = req.getSession().getServletContext().getRealPath("/storage/upload/") + "/temp/";
	    		
	    		File f = new File(file_path);
			FileOutputStream fos = null;
		    		if (!f.exists()) {
		    			f.mkdirs();
		    			System.out.println("创建了" + file_path + "文件夹.");
		    		}
		    		try {
		    			fos = new FileOutputStream(new File(
		    					file_path,
		    					file_id + 
		    					"." +
		    					file_extension));
		    			if (multiFile != null && !multiFile.isEmpty())
		    				fos.write(multiFile.getBytes());
		    			fos.close();
		    		} catch (Exception e) {
		    			System.out.println(e);
		    		} finally {
		    			if (fos != null)
		    				fos = null;
		    		}
		}
		return resulList;
	}
	
	public static List uploadFilesToList(HttpServletRequest req) throws Exception {
		return uploadFilesToList(req, ",");
	}
	
	public static List<Map> filesListToListMap(List fileList, String[] header) throws Exception {
		if (!(fileList != null && fileList.size() > 1 && header != null && header.length > 0))
			throw new Exception("请至少传入一列数据");
		List resultList = new ArrayList<Map>();
		for (int i = 1; i < fileList.size(); i++) {
			List row = (List) fileList.get(i);
			Map map = new LinkedCaseInsensitiveMap();
			for (int j = 0; j < header.length && j < row.size(); j++)
				map.put(header[j], row.get(j));
			resultList.add(map);
		}
		return resultList;
	}
	
	public static <T> List<T> filesListToListBean(List fileList, Class<T> clazz) throws SysException {
		List resultList = new ArrayList<T>();
		for (Object row : fileList)
			resultList.add(BeanMapConvertUtil.toBean(clazz, (Map)row));
		return resultList;
	}
	
	public static boolean writeMsg(HttpServletResponse res, String msg) {
		try {
			res.setContentType("text/html;charset=UTF-8");
			PrintWriter printWriter = res.getWriter();
			printWriter.write(msg);
			//printWriter.flush();
			printWriter.close();
		} catch (IOException e) {
			//donothing
			return false;
		}
		return true;
	}
	
	public static boolean alertMsg(HttpServletResponse res, String msg) {
		if (msg == null)
			msg = "不可思议的错误.";
		String newMsg = "<script>";
		newMsg += "alert('" + msg + "');";
		newMsg += "</script>";
		return writeMsg(res, newMsg);
	}
}
