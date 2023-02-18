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
			throw new SysException("发生错误");
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
		Date last_date;//最新一条经文的日期
		if(resultMap == null){
			//当resultMap = null,不能使用put方法，需要进行map对象初始化
		     resultMap = new HashMap();
			 last_date = new Date();
		}else{
			last_date = (Date) resultMap.get("last_create_date");
		}
		System.out.println(last_date + "最后一天的日期");
		
		try {
			if (last_date != null && !"".equals(last_date)) {
		        Calendar ca = Calendar.getInstance();
		        ca.setTime(last_date);
		        ca.add(Calendar.DATE, 1);// 增加一天
		        last_date = ca.getTime();
		        String next_date = format.format(last_date);
		        System.out.println("增加天数以后的日期：" + next_date);
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
			throw new SysException("发生错误");
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
			throw new SysException("发生错误");
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
		
		Integer last_scripture_no = customScriptureMapper.selectLastScriptureNo(paramMap);//获取某个类型经文下最后的日期
		if("".equals(last_scripture_no) || last_scripture_no == null){
			System.out.println("为null的值***********");
			last_scripture_no = 0;
		}
		String last_date = customScriptureMapper.selectLastDate(paramMap);//获取某个类型经文下最后的日期 
		String last_date_flag = last_date;//保存第一次获取的某种类型下最后一条经文的日期，根据这个判断是否需要增加1天
		System.out.println("数据库查询的最后一条经文的时间****"+last_date);
	    SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
	    if(StringUtil.isEmpty(last_date)){//如果是第一个经文，那么添加日期为今天
			   Date today = new Date();
			   last_date = format.format(today);
//			   System.out.println("是第一条经文****"+last_date);
		}
        Date currdate = format.parse(last_date);
//        System.out.println("现在的日期是：" + currdate);
        Calendar ca = Calendar.getInstance();
         ca.setTime(currdate);
//       如果将要添加经文类型是背章、诗篇、箴言,那么时间是周天的话，需要将日期加2.
        /* if("A".equals(type) || "B".equals(type)){
        	 ca.add(Calendar.DATE, 1);// num为增加的天数，可以改变的
         }else{
        	 ca.add(Calendar.DATE, 7);// num为增加的天数，可以改变的
         }*/
   /*      if(!StringUtil.isEmpty(last_date_flag)){//如果添加的不是第一条经文，那么添加经文的日子+1
        	 ca.add(Calendar.DATE, 1);// num为增加的天数，可以改变的
         }*/
         ca.add(Calendar.DATE, 1);// num为增加的天数，可以改变的
         if("C".equals(type) || "D".equals(type) || "E".equals(type) || "F".equals(type)){
        	 int week = ca.get(Calendar.DAY_OF_WEEK);
        	 System.out.println(week + "为1则为星期天");
        	 if(week == 1){
        		ca.add(Calendar.DATE, 1);//如果为周天，那么跳过这个日期，直接到星期一
        	 }
         }
         currdate = ca.getTime();
         String enddate = format.format(currdate);
         System.out.println("增加天数以后的日期：" + enddate);
         paramMap.put("createDate", enddate);
 		/*String scriptNoPinyin = paramMap.get("scriptureNoFlag") + 
				StringUtil.converterToSpell(StringUtil.replaceSpecStr(enddate));*/
		paramMap.put("scriptureNo", (String)paramMap.get("scriptureNoFlag") + (last_scripture_no + 1));//新添加的经文编号是在当前数据库中最后的一个上加一
		
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
			throw new SysException("发生错误");
		}
		return j;
	}
	
	@ResponseBody
	@RequestMapping("/getVolumeChapterVerse")//获取圣经某卷某章某节经文
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
	@RequestMapping("/getScriptureByBible")//获取圣经某卷某章某节经文
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
		
		int[] memoPeriodArr = {1, 2, 4, 7, 15, 30, 90, 180};//记忆曲线周期
		List readSriptureNoArr = new ArrayList();//查询经文所需编号
		String type = (String) paramMap.get("type");
		int scriptureNoNew = scriptureServiceImpl.searchScripturesByDate(paramMap);
		System.out.println("**********************");
		System.out.println(scriptureNoNew);
		System.out.println("**********************");
		readSriptureNoArr.add(0, type + scriptureNoNew);
		for(int i = 0; i < memoPeriodArr.length; i++){
			int tempNo = (scriptureNoNew) - memoPeriodArr[i];//复习经文编号
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
			// 将excel文件保存到本地
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
							throw new SysException("请上传正确的文件!");
						// if(file_extension.equals("xlsx")) throw new
						// SysException("仅支持2003版本的Excel!");
						File f = new File(file_path);
						FileOutputStream fos = null;
						if (!f.exists()) {
							f.mkdirs();
							System.out.println("创建了" + file_path + "文件夹.");
						}

						file_path = file_path + "test." + file_extension;
						try {
							fos = new FileOutputStream(file_path);
							if (multiFile != null && !multiFile.isEmpty())
								fos.write(multiFile.getBytes());
						} catch (Exception e) {
							uploadSuccess = false;
							System.out.println(e);
							throw new SysException("写文件错误.");
						} finally {
							if (fos != null)
								try {
									fos.close();
									fos = null;
								} catch (IOException e) {
									uploadSuccess = false;
									System.out.println(e);
									throw new SysException("关闭文件流错误.");
								}
						}
					}
				}
			}
			// 将excel表中内容读出来
			if (uploadSuccess) {
				/*InputStream input = new FileInputStream(file_path); // 建立输入流
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
			throw new SysException("上传excel出现异常。");
		}

		return j;
	}

	public void readExcel(HttpServletRequest req, String fileName, int sheetNum) throws SysException {
		try {
			InputStream input = new FileInputStream(fileName); // 建立输入流
			Workbook wb = null;
			boolean isExcel2003 = true;
			Sheet sheet;
			Iterator<Row> rows = null;
			if (WDUtil.isExcel2007(fileName)) {// 我是用本地2013作的excel表，改了后缀名为xls格式的，
				// 虽然判断后认为事2003以前的，但实际解析还是为2007以上的文件格式。
				isExcel2003 = false;
			}
			if (isExcel2003) {
				wb = new HSSFWorkbook(input);// hssF是Excel2003以前（包括2003）的版本没有问题
				sheet = (HSSFSheet) wb.getSheetAt(sheetNum);
				rows = sheet.rowIterator();
			} else {
				wb = new XSSFWorkbook(input);
				sheet = (XSSFSheet) wb.getSheetAt(sheetNum);
				rows = sheet.rowIterator();
			}

			// 获取excel表中有数据的行数
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
			System.out.println("lineNum已读行数" + dataRowNum);
			// 获取表中的数据，每个公司信息存一个Map，所有的放在一个List<Map>中,同样的，每个用户信息存一个Map，所有的放在一个List<Map>中。
			List<Map> scripture_list = new ArrayList();
			System.out.println("sheet工作表index" + sheetNum);
			int line = 0;
			while (rows.hasNext()) {
				Map scriptureMap = new HashMap();
				Row row = rows.next(); // 获得行数据
				Iterator<Cell> cells = row.cellIterator();// 获得第一行的迭代器
				if (line != 0) {
					String[] list = new String[4];
					int num = 0;
					while (cells.hasNext()) {
						Cell cell = cells.next();
						if (num != cell.getColumnIndex()) {
							list[num] = "";
							num++;// 这里的num++为什么要写两个。
						}
						list[num] = getValue(cell).trim();
						num++;
					}
					// if(list[5].equals("")) throw new
					// BusinessException("第"+(line+1)+"行"+"请保证用户类型或公司类型不为空!",-817);
					// 判断不能为空
					//由于下面的判断方法，如果有空值的时候，会报空指针异常，应该这样写："".equals(list[0])
					/*if (list[0].equals(""))
						throw new SysException("第" + (line + 1) + "行" + "圣经编号不能为空!");
					if (list[1].equals(""))
						throw new SysException("第" + (line + 1) + "行" + "内容不能为空!");
					if (list[2].equals(""))
						throw new SysException("第" + (line + 1) + "行" + "时间不能为空!");*/
					
//					scriptureMap.put("id", MD5Util.toSHA256(DateUtil.nowTimeMilli()));
					scriptureMap.put("create_date", list[0]);
					scriptureMap.put("scripture_no", list[1]);
					scriptureMap.put("type", list[1].substring(0, 1));
					scriptureMap.put("scripture_text", list[2]);
//					scriptureMap.put("url", list[3]);
					scripture_list.add(scriptureMap);
					System.out.println("第一個單元格的内容" + list[0] + "&&&&共" + dataRowNum +"行");
					System.out.println("第二個單元格的内容" + list[1] + "&&&&共" + dataRowNum +"行");
				}

				if (line == dataRowNum)
					break;
				line++;
			}
			System.out.println("已读"+ line +"行");
			// 将数据存入数据库
			for (Map map : scripture_list) {
				if(insertScripture(map) == 0)
					throw new SysException("导入失败!");
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
					// 返回布尔类型的值
					return toString(hssfCell.getBooleanCellValue());
				} else if (hssfCell.getCellType() == hssfCell.CELL_TYPE_NUMERIC) {
					try {
						// 返回数值类型的值
						boolean isCellDateFormatted = HSSFDateUtil.isCellDateFormatted(hssfCell);
						if (isCellDateFormatted) {
							short format = hssfCell.getCellStyle().getDataFormat();
							SimpleDateFormat sdf = null;
							if (format == 14 || format == 31 || format == 57 || format == 58) {
								// 日期
								sdf = new SimpleDateFormat("yyyy-MM-dd");
							} else if (format == 20 || format == 32) {
								// 时间
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
					// 返回字符串类型的值
					return toString(hssfCell.getStringCellValue());
				}
			} catch (Exception e) {
				return "";
			}
		}
	}

	// 只要没有数据,就判断为空行,不管它是不是有格式,而poi自带的row == null,指的是既没有数据又没有格式Style
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
			throw new SysException("参数不能为空~");
		return BeanMapConvertUtil.toBean(clazz, map);
	}
	public int insertScripture(Map map){
		return scriptureServiceImpl.insertScripture(map);
	}
}
