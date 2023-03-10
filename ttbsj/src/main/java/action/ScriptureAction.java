package action;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.swing.Spring;

import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.charts.ManuallyPositionable;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.codehaus.jackson.JsonFactory;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.SerializationConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartRequest;

import customMapper.CustomScriptureMapper;
import exception.SysException;
import pageModel.EasyUIGridObj;
import pageModel.JsonResult;
import pageModel.Scripture;
import service.ScriptureService;
import util.BeanMapConvertUtil;
import util.DateUtil;
import util.MD5Util;
import util.MSG_CONST;
import util.SpringUtils;
import util.StringUtil;
import util.WDUtil;

@SuppressWarnings("rawtypes")
@Controller
@RequestMapping("/scriptureAction")
public class ScriptureAction {

	@Autowired
	private ScriptureService scriptureServiceImpl;
	@Autowired
	private CustomScriptureMapper customScriptureMapper;
	
	@ResponseBody
	@RequestMapping("/modScripture")
	public JsonResult modScripture(HttpServletRequest req) throws Exception {
		JsonResult j = new JsonResult();
		Map paramMap = new HashMap();
		paramMap = SpringUtils.getParameterMap(req);
		try {
			if (customScriptureMapper.modScripture(paramMap) > 0) {
				j.setSuccess(true);
				j.setMsg(MSG_CONST.UPDATESUCCESS);
			} else {
				j.setSuccess(false);
				j.setMsg(MSG_CONST.UPDATEFAIL);
			}
		} catch (Exception e) {
			System.out.println(e);
			throw new SysException("????????????");
		}
		return j;
	}
	
	@ResponseBody
	@RequestMapping("/getNextScriptureDate")
	public JsonResult getNextScriptureDate(HttpServletRequest req) throws Exception {
		JsonResult j = new JsonResult();
		Map paramMap = new HashMap();
		paramMap = SpringUtils.getParameterMap(req);
		Map resultMap = customScriptureMapper.getNextScriptureDate(paramMap);
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		Date last_date;//???????????????????????????
		if(resultMap == null){
			//???resultMap = null,????????????put?????????????????????map???????????????
		     resultMap = new HashMap();
			 last_date = new Date();
		}else{
			last_date = (Date) resultMap.get("last_create_date");
		}
		System.out.println(last_date + "?????????????????????");
		
		try {
			if (last_date != null && !"".equals(last_date)) {
		        Calendar ca = Calendar.getInstance();
		        ca.setTime(last_date);
		        ca.add(Calendar.DATE, 1);// ????????????
		        last_date = ca.getTime();
		        String next_date = format.format(last_date);
		        System.out.println("??????????????????????????????" + next_date);
		        resultMap.put("next_create_date", next_date);
		        j.setResult(resultMap);
				j.setSuccess(true);
				j.setMsg(MSG_CONST.READSUCCESS);
			} else {
				j.setSuccess(false);
				j.setMsg(MSG_CONST.READFAIL);
			}
		} catch (Exception e) {
			System.out.println(e);
			throw new SysException("????????????");
		}
		return j;
	}
	@ResponseBody
	@RequestMapping("/getPrevScripture")
	public JsonResult getPrevScripture(HttpServletRequest req) throws Exception {
		JsonResult j = new JsonResult();
		Map paramMap = new HashMap();
		paramMap = SpringUtils.getParameterMap(req);
		Map resultMap = customScriptureMapper.getPrevScripture(paramMap);
		try {
			if (resultMap != null && !"".equals(resultMap)) {
		        j.setResult(resultMap);
				j.setSuccess(true);
				j.setMsg(MSG_CONST.READSUCCESS);
			} else {
				j.setSuccess(false);
				j.setMsg(MSG_CONST.READFAIL);
			}
		} catch (Exception e) {
			System.out.println(e);
			throw new SysException("????????????");
		}
		return j;
	}
	@ResponseBody
	@RequestMapping("/addScripture")
	public JsonResult addScripture(HttpSession session, HttpServletRequest req) throws Exception {
		JsonResult j = new JsonResult();
		Map paramMap = new HashMap();
		paramMap = SpringUtils.getParameterMap(req);
//		Scripture sp = MapToBean(Scripture.class, paramMap);
//		String create_date = paramMap.get("create_date").toString();
		String type = paramMap.get("scriptureNoFlag").toString();
		
		Integer last_scripture_no = customScriptureMapper.selectLastScriptureNo(paramMap);//??????????????????????????????????????????
		if("".equals(last_scripture_no) || last_scripture_no == null){
			System.out.println("???null??????***********");
			last_scripture_no = 0;
		}
		String last_date = customScriptureMapper.selectLastDate(paramMap);//?????????????????????????????????????????? 
		String last_date_flag = last_date;//?????????????????????????????????????????????????????????????????????????????????????????????????????????1???
		System.out.println("?????????????????????????????????????????????****"+last_date);
	    SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
	    if(StringUtil.isEmpty(last_date)){//??????????????????????????????????????????????????????
			   Date today = new Date();
			   last_date = format.format(today);
//			   System.out.println("??????????????????****"+last_date);
		}
        Date currdate = format.parse(last_date);
//        System.out.println("?????????????????????" + currdate);
        Calendar ca = Calendar.getInstance();
         ca.setTime(currdate);
//       ?????????????????????????????????????????????????????????,????????????????????????????????????????????????2.
        /* if("A".equals(type) || "B".equals(type)){
        	 ca.add(Calendar.DATE, 1);// num????????????????????????????????????
         }else{
        	 ca.add(Calendar.DATE, 7);// num????????????????????????????????????
         }*/
   /*      if(!StringUtil.isEmpty(last_date_flag)){//??????????????????????????????????????????????????????????????????+1
        	 ca.add(Calendar.DATE, 1);// num????????????????????????????????????
         }*/
         ca.add(Calendar.DATE, 1);// num????????????????????????????????????
         if("C".equals(type) || "D".equals(type) || "E".equals(type) || "F".equals(type)){
        	 int week = ca.get(Calendar.DAY_OF_WEEK);
        	 System.out.println(week + "???1???????????????");
        	 if(week == 1){
        		ca.add(Calendar.DATE, 1);//???????????????????????????????????????????????????????????????
        	 }
         }
         currdate = ca.getTime();
         String enddate = format.format(currdate);
         System.out.println("??????????????????????????????" + enddate);
         paramMap.put("createDate", enddate);
 		/*String scriptNoPinyin = paramMap.get("scriptureNoFlag") + 
				StringUtil.converterToSpell(StringUtil.replaceSpecStr(enddate));*/
		paramMap.put("scriptureNo", (String)paramMap.get("scriptureNoFlag") + (last_scripture_no + 1));//????????????????????????????????????????????????????????????????????????
		
		try {
			if (customScriptureMapper.insertScriptureByManual(paramMap) > 0) {
				j.setSuccess(true);
				j.setMsg(MSG_CONST.ADDSUCCESS);
			} else {
				j.setSuccess(false);
				j.setMsg(MSG_CONST.ADDFAIL);
			}
		} catch (Exception e) {
			System.out.println(e);
			throw new SysException("????????????");
		}
		return j;
	}
	
	@ResponseBody
	@RequestMapping("/getVolumeChapterVerse")//????????????????????????????????????
	public JsonResult getVolumeChapterVerse(HttpServletRequest req) throws SysException {
		JsonResult j = new JsonResult();
		Map paramMap = new HashMap();
		paramMap = SpringUtils.getParameterMap(req);
		List spList = customScriptureMapper.getVolumeChapterVerse(paramMap);
		if (spList != null && spList.size() > 0) {
			j.setSuccess(true);
			j.setMsg(MSG_CONST.READSUCCESS);
			j.setResult(spList);
		} else {
			j.setSuccess(false);
			j.setMsg(MSG_CONST.READFAIL);
		}
		return j;
	}
	@ResponseBody
	@RequestMapping("/getScriptureByBible")//????????????????????????????????????
	public JsonResult getScriptureByBile(HttpServletRequest req) throws SysException {
		JsonResult j = new JsonResult();
		Map paramMap = new HashMap();
		paramMap = SpringUtils.getParameterMap(req);
		List spList = customScriptureMapper.getScriptureByBible(paramMap);
		if (spList != null && spList.size() > 0) {
			j.setSuccess(true);
			j.setMsg(MSG_CONST.READSUCCESS);
			j.setResult(spList);
		} else {
			j.setSuccess(false);
			j.setMsg(MSG_CONST.READFAIL);
		}
		return j;
	}
	@ResponseBody
	@RequestMapping("/searchScripturesByDate")
	public JsonResult searchScripturesByDate(HttpServletRequest req) throws SysException {
		JsonResult j = new JsonResult();
		Map paramMap = new HashMap();
		paramMap = SpringUtils.getParameterMap(req);
		
		int[] memoPeriodArr = {1, 2, 4, 7, 15, 30, 90, 180};//??????????????????
		List readSriptureNoArr = new ArrayList();//????????????????????????
		String type = (String) paramMap.get("type");
		int scriptureNoNew = scriptureServiceImpl.searchScripturesByDate(paramMap);
		System.out.println("**********************");
		System.out.println(scriptureNoNew);
		System.out.println("**********************");
		readSriptureNoArr.add(0, type + scriptureNoNew);
		for(int i = 0; i < memoPeriodArr.length; i++){
			int tempNo = (scriptureNoNew) - memoPeriodArr[i];//??????????????????
			if(tempNo > 0){
				readSriptureNoArr.add(i + 1, type + tempNo);
			}else{
				break;
			}
		}
		paramMap.put("readSriptureNoList", readSriptureNoArr);
		List<Scripture> spList = scriptureServiceImpl.searchScriptures(paramMap);
		if (spList != null && spList.size() > 0) {
			j.setSuccess(true);
			j.setMsg(MSG_CONST.READSUCCESS);
			j.setResult(spList);
		} else {
			j.setSuccess(false);
			j.setMsg(MSG_CONST.READFAIL);
		}
		return j;
	}
	
	@ResponseBody
	@RequestMapping("/impScriptureBatch")
	public JsonResult impScriptureBatch(HttpSession session, HttpServletRequest req) throws SysException {
		JsonResult j = new JsonResult();
		try {
			Boolean uploadSuccess = true;
			String file_path = "";
			// ???excel?????????????????????
			req.setCharacterEncoding("UTF-8");
			MultipartRequest multiReq = (MultipartRequest) req;
			Iterator<String> files = multiReq.getFileNames();
			while (files.hasNext()) {
				String fileName = (String) files.next();
				MultipartFile multiFile = multiReq.getFile(fileName);
				if (multiFile != null && !multiFile.isEmpty()) {
					file_path = req.getSession().getServletContext().getRealPath("/storage/");
					if (multiFile != null && !multiFile.isEmpty()) {
						String originName = multiFile.getOriginalFilename();
						originName = URLDecoder.decode(originName, "UTF-8");
						String file_extension = (originName.substring(originName.lastIndexOf(".") + 1)).toLowerCase();
						if (!file_extension.equals("xls") && !file_extension.equals("xlsx"))
							throw new SysException("????????????????????????!");
						// if(file_extension.equals("xlsx")) throw new
						// SysException("?????????2003?????????Excel!");
						File f = new File(file_path);
						FileOutputStream fos = null;
						if (!f.exists()) {
							f.mkdirs();
							System.out.println("?????????" + file_path + "?????????.");
						}

						file_path = file_path + "test." + file_extension;
						try {
							fos = new FileOutputStream(file_path);
							if (multiFile != null && !multiFile.isEmpty())
								fos.write(multiFile.getBytes());
						} catch (Exception e) {
							uploadSuccess = false;
							System.out.println(e);
							throw new SysException("???????????????.");
						} finally {
							if (fos != null)
								try {
									fos.close();
									fos = null;
								} catch (IOException e) {
									uploadSuccess = false;
									System.out.println(e);
									throw new SysException("?????????????????????.");
								}
						}
					}
				}
			}
			// ???excel?????????????????????
			if (uploadSuccess) {
				/*InputStream input = new FileInputStream(file_path); // ???????????????
				POIFSFileSystem fs = new POIFSFileSystem( input );
				Workbook xs = new XSSFWorkbook(input);
				System.out.println(xs.getNumberOfSheets());*/
				for(int i = 0; i < 5; i++)
					readExcel(req, file_path, i);
				File f = new File(file_path);
				f.delete();
			}

		} catch (Exception e) {
			System.out.println(e);
			throw new SysException("??????excel???????????????");
		}

		return j;
	}

	public void readExcel(HttpServletRequest req, String fileName, int sheetNum) throws SysException {
		try {
			InputStream input = new FileInputStream(fileName); // ???????????????
			Workbook wb = null;
			boolean isExcel2003 = true;
			Sheet sheet;
			Iterator<Row> rows = null;
			if (WDUtil.isExcel2007(fileName)) {// ???????????????2013??????excel????????????????????????xls????????????
				// ????????????????????????2003????????????????????????????????????2007????????????????????????
				isExcel2003 = false;
			}
			if (isExcel2003) {
				wb = new HSSFWorkbook(input);// hssF???Excel2003???????????????2003????????????????????????
				sheet = (HSSFSheet) wb.getSheetAt(sheetNum);
				rows = sheet.rowIterator();
			} else {
				wb = new XSSFWorkbook(input);
				sheet = (XSSFSheet) wb.getSheetAt(sheetNum);
				rows = sheet.rowIterator();
			}

			// ??????excel????????????????????????
			int numOfRow = sheet.getLastRowNum();
			int dataRowNum = 0;
			if (numOfRow > 0) {
				for (int rowNum = 1; rowNum <= numOfRow; rowNum++) {
					Row hssfRow = sheet.getRow(rowNum);
					if (isEmptyRow1(hssfRow) == false) {
						dataRowNum++;
					}
				}
			}
			System.out.println("lineNum????????????" + dataRowNum);
			// ???????????????????????????????????????????????????Map????????????????????????List<Map>???,???????????????????????????????????????Map????????????????????????List<Map>??????
			List<Map> scripture_list = new ArrayList();
			System.out.println("sheet?????????index" + sheetNum);
			int line = 0;
			while (rows.hasNext()) {
				Map scriptureMap = new HashMap();
				Row row = rows.next(); // ???????????????
				Iterator<Cell> cells = row.cellIterator();// ???????????????????????????
				if (line != 0) {
					String[] list = new String[4];
					int num = 0;
					while (cells.hasNext()) {
						Cell cell = cells.next();
						if (num != cell.getColumnIndex()) {
							list[num] = "";
							num++;// ?????????num++????????????????????????
						}
						list[num] = getValue(cell).trim();
						num++;
					}
					// if(list[5].equals("")) throw new
					// BusinessException("???"+(line+1)+"???"+"?????????????????????????????????????????????!",-817);
					// ??????????????????
					//???????????????????????????????????????????????????????????????????????????????????????????????????"".equals(list[0])
					/*if (list[0].equals(""))
						throw new SysException("???" + (line + 1) + "???" + "????????????????????????!");
					if (list[1].equals(""))
						throw new SysException("???" + (line + 1) + "???" + "??????????????????!");
					if (list[2].equals(""))
						throw new SysException("???" + (line + 1) + "???" + "??????????????????!");*/
					
//					scriptureMap.put("id", MD5Util.toSHA256(DateUtil.nowTimeMilli()));
					scriptureMap.put("create_date", list[0]);
					scriptureMap.put("scripture_no", list[1]);
					scriptureMap.put("type", list[1].substring(0, 1));
					scriptureMap.put("scripture_text", list[2]);
//					scriptureMap.put("url", list[3]);
					scripture_list.add(scriptureMap);
					System.out.println("???????????????????????????" + list[0] + "&&&&???" + dataRowNum +"???");
					System.out.println("???????????????????????????" + list[1] + "&&&&???" + dataRowNum +"???");
				}

				if (line == dataRowNum)
					break;
				line++;
			}
			System.out.println("??????"+ line +"???");
			// ????????????????????????
			for (Map map : scripture_list) {
				if(insertScripture(map) == 0)
					throw new SysException("????????????!");
			}

		} catch (IOException ex) {
			ex.printStackTrace();
		}
	}

	private static String getValue(Cell hssfCell) {
		if (hssfCell == null) {
			return "";
		} else {
			try {
				if (hssfCell.getCellType() == hssfCell.CELL_TYPE_BOOLEAN) {
					// ????????????????????????
					return toString(hssfCell.getBooleanCellValue());
				} else if (hssfCell.getCellType() == hssfCell.CELL_TYPE_NUMERIC) {
					try {
						// ????????????????????????
						boolean isCellDateFormatted = HSSFDateUtil.isCellDateFormatted(hssfCell);
						if (isCellDateFormatted) {
							short format = hssfCell.getCellStyle().getDataFormat();
							SimpleDateFormat sdf = null;
							if (format == 14 || format == 31 || format == 57 || format == 58) {
								// ??????
								sdf = new SimpleDateFormat("yyyy-MM-dd");
							} else if (format == 20 || format == 32) {
								// ??????
								sdf = new SimpleDateFormat("HH:mm");
							}
							double value = hssfCell.getNumericCellValue();
							Date date = org.apache.poi.ss.usermodel.DateUtil.getJavaDate(value);
							return sdf.format(date);
						} else {
							try {
								DecimalFormat df = new DecimalFormat("0");
								String number = df.format(hssfCell.getNumericCellValue());
								return number;

							} catch (Exception e) {
								return toString(hssfCell.getNumericCellValue());
							}
						}
					} catch (Exception e) {
						return toString(hssfCell.getNumericCellValue());
					}
				} else {
					// ???????????????????????????
					return toString(hssfCell.getStringCellValue());
				}
			} catch (Exception e) {
				return "";
			}
		}
	}

	// ??????????????????,??????????????????,???????????????????????????,???poi?????????row == null,???????????????????????????????????????Style
	public static boolean isEmptyRow1(Row hssfRow) {
		int temp = 0;
		boolean isEmptyRow = false;
		if (hssfRow == null) {
			isEmptyRow = true;
		} else {
			for (int i = 0; i <= hssfRow.getLastCellNum(); i++) {
				if (hssfRow.getCell(i) != null) {
					if (getValue(hssfRow.getCell(i)) != null && !("".equals(getValue(hssfRow.getCell(i))))) {
						temp++;
					}
				}
			}
			if (temp == 0) {
				isEmptyRow = true;
			}
		}
		return isEmptyRow;
	}

	public static String toString(Object object) {
		String temp = "";
		if (object != null) {
			temp = object.toString();
		}
		return temp;
	}
	
	public <T> T MapToBean(Class<T> clazz, Map map) throws SysException {
		if (map == null)
			throw new SysException("??????????????????~");
		return BeanMapConvertUtil.toBean(clazz, map);
	}
	public int insertScripture(Map map){
		return scriptureServiceImpl.insertScripture(map);
	}
}
