package util;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.imageio.ImageIO;

import org.apache.commons.io.FilenameUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFClientAnchor;
import org.apache.poi.hssf.usermodel.HSSFPatriarch;
import org.apache.poi.hssf.usermodel.HSSFPrintSetup;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.CellRangeAddress;
import org.apache.poi.hssf.util.Region;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CellValue;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.FormulaEvaluator;
import org.apache.poi.ss.usermodel.PrintSetup;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import exception.SysException;

/**
 * @ClassName POIUtils
 * @Description Copyright (c) 2014 by NS Soft.
 * @author xuliguo ZhangSong lichunhao
 * @date 2015年3月16日 下午8:03:09
 * @version V1.0
 */
@SuppressWarnings({ "deprecation", "rawtypes", "unchecked", "resource" })
public class POIUtil {

	
	public static void copyRow(Workbook fromWb, Workbook toWb, HSSFSheet fromSheet, HSSFSheet toSheet, int fromStart,
			int fromEnd, int toStart) {
		int fromSizeOfRow = fromEnd - fromStart + 1;
		int cellSize = 0;
		HSSFRow fromStartRow = null;
		HSSFRow toStartRow = null;
		int tempToStart = toStart;
		for (int i = 0; i < fromSizeOfRow; i++) {
			fromStartRow = fromSheet.getRow(fromStart);
			toStartRow = toSheet.createRow(toStart);

			fromStart++;
			toStart++;
			if (fromStartRow != null && !"".equals(fromStartRow))
				cellSize = fromStartRow.getLastCellNum();
			else
				continue;
			for (int j = 0; j < cellSize; j++)
				if (fromStartRow.getCell(j) != null) {
					setCellValue(POIUtil.getValue(fromStartRow.getCell(j)), toStartRow.createCell(j));

					toStartRow.getCell(j).setCellStyle(fromStartRow.getCell(j).getCellStyle());

					toStartRow.getCell(j).setCellType(fromStartRow.getCell(j).getCellType());

					toStartRow.setHeightInPoints(fromStartRow.getHeightInPoints());
				}
		}
		fromStart = fromStart - fromSizeOfRow;
		toStart = toStart - fromSizeOfRow;
		// 复制图片和文本框和合并单元格
		POIUtil.copyMergedRegion(fromWb, toWb, fromSheet, toSheet, fromStart, fromEnd, tempToStart);
	}

	public static void setCellValue(Object object, Cell cell) {
		try {
			if (cell != null)
				try {
					String temp = POIUtil.toString(object).trim();
					int cellType = cell.getCellType();
					switch (cellType) {
					// 常规
						case Cell.CELL_TYPE_BLANK:
							if (object != null && !"".equals(temp)) {
								boolean isCellDateFormatted = DateUtil.isCellDateFormatted(cell);
								if (isCellDateFormatted && object instanceof Date)
									cell.setCellValue(POIUtil.toDate((Date) object));
								else if (temp.matches("^[-+]?(([0-9]+)([.]([0-9]+))?|([.]([0-9]+))?)$")
										&& !"-".equals(temp) && !"+".equals(temp))
									cell.setCellValue(Double.parseDouble(temp));
								else {
									if (temp.contains("null"))
										temp = temp.replace("null", "");
									if (temp.contains("NULL"))
										temp = temp.replace("NULL", "");
									if (temp.contains("Null"))
										temp = temp.replace("Null", "");
									cell.setCellValue(temp);
								}
							} else
								cell.setCellValue("");
							break;
						// 貌似这个也用不到啊,资料里显示的Date和货币都属于这个类型,但实际上都属于CELL_TYPE_BLANK
						case Cell.CELL_TYPE_NUMERIC:
							if (object != null && !"".equals(temp)) {
								boolean isCellDateFormatted = DateUtil.isCellDateFormatted(cell);
								if (isCellDateFormatted && object instanceof Date)
									cell.setCellValue(POIUtil.toDate((Date) object));
								else if (temp.matches("^[-+]?(([0-9]+)([.]([0-9]+))?|([.]([0-9]+))?)$")
										&& !"-".equals(temp) && !"+".equals(temp))
									cell.setCellValue(Double.parseDouble(temp));
								else {
									if (temp.contains("null"))
										temp = temp.replace("null", "");
									if (temp.contains("NULL"))
										temp = temp.replace("NULL", "");
									if (temp.contains("Null"))
										temp = temp.replace("Null", "");
									cell.setCellValue(temp);
								}
							} else
								cell.setCellValue("");
							break;
						case Cell.CELL_TYPE_STRING:
							if (object != null && !"".equals(temp)) {
								if (temp.contains("null"))
									temp = temp.replace("null", "");
								if (temp.contains("NULL"))
									temp = temp.replace("NULL", "");
								if (temp.contains("Null"))
									temp = temp.replace("Null", "");
								cell.setCellValue(temp);
							} else
								cell.setCellValue("");
							break;
						default:
							break;
					}
				} catch (Exception e) {
					System.out.println("导出的数据不符合excel的格式");
				}
		} catch (Exception e) {
			System.out.println(e);
		}
	}
	
	public static void setXSSFCellValue(Object object, XSSFCell cell) {
		try {
			if (cell != null)
				try {
					String temp = POIUtil.toString(object).trim();
					int cellType = cell.getCellType();
					switch (cellType) {
					// 常规
						case Cell.CELL_TYPE_BLANK:
							if (object != null && !"".equals(temp)) {
								boolean isCellDateFormatted = DateUtil.isCellDateFormatted(cell);
								if (isCellDateFormatted && object instanceof Date)
									cell.setCellValue(POIUtil.toDate((Date) object));
								else if (temp.matches("^[-+]?(([0-9]+)([.]([0-9]+))?|([.]([0-9]+))?)$")
										&& !"-".equals(temp) && !"+".equals(temp))
									cell.setCellValue(Double.parseDouble(temp));
								else {
									if (temp.contains("null"))
										temp = temp.replace("null", "");
									if (temp.contains("NULL"))
										temp = temp.replace("NULL", "");
									if (temp.contains("Null"))
										temp = temp.replace("Null", "");
									cell.setCellValue(temp);
								}
							} else
								cell.setCellValue("");
							break;
						// 貌似这个也用不到啊,资料里显示的Date和货币都属于这个类型,但实际上都属于CELL_TYPE_BLANK
						case Cell.CELL_TYPE_NUMERIC:
							if (object != null && !"".equals(temp)) {
								boolean isCellDateFormatted = DateUtil.isCellDateFormatted(cell);
								if (isCellDateFormatted && object instanceof Date)
									cell.setCellValue(POIUtil.toDate((Date) object));
								else if (temp.matches("^[-+]?(([0-9]+)([.]([0-9]+))?|([.]([0-9]+))?)$")
										&& !"-".equals(temp) && !"+".equals(temp))
									cell.setCellValue(Double.parseDouble(temp));
								else {
									if (temp.contains("null"))
										temp = temp.replace("null", "");
									if (temp.contains("NULL"))
										temp = temp.replace("NULL", "");
									if (temp.contains("Null"))
										temp = temp.replace("Null", "");
									cell.setCellValue(temp);
								}
							} else
								cell.setCellValue("");
							break;
						case Cell.CELL_TYPE_STRING:
							if (object != null && !"".equals(temp)) {
								if (temp.contains("null"))
									temp = temp.replace("null", "");
								if (temp.contains("NULL"))
									temp = temp.replace("NULL", "");
								if (temp.contains("Null"))
									temp = temp.replace("Null", "");
								cell.setCellValue(temp);
							} else
								cell.setCellValue("");
							break;
						default:
							break;
					}
				} catch (Exception e) {
					System.out.println("导出的数据不符合excel的格式");
				}
		} catch (Exception e) {
			System.out.println(e);
		}
	}

	public static String getStringCellValue(HSSFCell cell) {
		String strCell = "";
		switch (cell.getCellType()) {
			case Cell.CELL_TYPE_STRING:
				strCell = cell.getStringCellValue();
				break;
			case Cell.CELL_TYPE_NUMERIC:
				strCell = String.valueOf(cell.getNumericCellValue());
				break;
			case Cell.CELL_TYPE_BOOLEAN:
				strCell = String.valueOf(cell.getBooleanCellValue());
				break;
			case Cell.CELL_TYPE_BLANK:
				strCell = "";
				break;
			default:
				strCell = "";
				break;
		}
		
		return strCell;
	}
	
	/**
	 * 获取单元格数据内容为日期类型的数据
	 *
	 * @param cell
	 *            Excel单元格
	 * @return String 单元格数据内容
	 */
	public static String getDateCellValue(HSSFCell cell) {
		String result = "";
		try {
			int cellType = cell.getCellType();
			if (cellType == Cell.CELL_TYPE_NUMERIC) {
				Date date = cell.getDateCellValue();
				result = date.getYear() + 1900 + "-" + (date.getMonth() + 1) + "-" + date.getDate();
			} else if (cellType == Cell.CELL_TYPE_STRING) {
				String date = getStringCellValue(cell);
				result = date.replaceAll("[年月]", "-").replace("日", "").trim();
			} else if (cellType == Cell.CELL_TYPE_BLANK)
				result = "";
		} catch (Exception e) {
			System.out.println("日期格式不正确!");
			e.printStackTrace();
		}
		return result;
	}
	
	/**
	 * 根据HSSFCell类型设置数据
	 *
	 * @param cell
	 * @return
	 */
	public static String getCellFormatValue(HSSFCell cell) {
		String cellvalue = "";
		if (cell != null)
			// 判断当前Cell的Type
			switch (cell.getCellType()) {
				// 如果当前Cell的Type为NUMERIC
				case Cell.CELL_TYPE_NUMERIC:
				case Cell.CELL_TYPE_FORMULA: {
					// 判断当前的cell是否为Date
					if (DateUtil.isCellDateFormatted(cell)) {
						// 如果是Date类型则，转化为Data格式
						
						// 方法1：这样子的data格式是带时分秒的：2011-10-12 0:00:00
						// cellvalue = cell.getDateCellValue().toLocaleString();
						
						// 方法2：这样子的data格式是不带带时分秒的：2011-10-12
						Date date = cell.getDateCellValue();
						SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
						cellvalue = sdf.format(date);
						
					} else
						// 取得当前Cell的数值
						cellvalue = String.valueOf(cell.getNumericCellValue());
					break;
				}
				// 如果当前Cell的Type为STRIN
				case Cell.CELL_TYPE_STRING:
					// 取得当前的Cell字符串
					cellvalue = cell.getRichStringCellValue().getString();
					break;
				// 默认的Cell值
				default:
					cellvalue = " ";
			}
		else
			cellvalue = "";
		return cellvalue;
		
	}
	
	public static String getValue(Cell hssfCell) {
		if (hssfCell == null)
			return "";
		else
			try {
				if (hssfCell.getCellType() == Cell.CELL_TYPE_BOOLEAN)
					// 返回布尔类型的值
					return toString(hssfCell.getBooleanCellValue());
				else if (hssfCell.getCellType() == Cell.CELL_TYPE_NUMERIC)
					try {
						
						// 返回数值类型的值
						boolean isCellDateFormatted = DateUtil.isCellDateFormatted(hssfCell);
						if (isCellDateFormatted) {
							short format = hssfCell.getCellStyle().getDataFormat();
							SimpleDateFormat sdf = null;
							if (format == 14 || format == 31 || format == 57 || format == 58)
								// 日期
								sdf = new SimpleDateFormat("yyyy-MM-dd");
							else if (format == 20 || format == 32)
								// 时间
								sdf = new SimpleDateFormat("HH:mm");
							double value = hssfCell.getNumericCellValue();
							Date date = org.apache.poi.ss.usermodel.DateUtil.getJavaDate(value);
							return sdf.format(date);
						} else
							try {
								DecimalFormat df = new DecimalFormat("0");
								String number = df.format(hssfCell.getNumericCellValue());
								return number;
								
							} catch (Exception e) {
								return toString(hssfCell.getNumericCellValue());
							}
					} catch (Exception e) {
						return toString(hssfCell.getNumericCellValue());
					}
				else
					// 返回字符串类型的值
					return toString(hssfCell.getStringCellValue());
			} catch (Exception e) {
				return "";
			}
	}
	
	public static String toString(Object object) {
		String temp = "";
		if (object != null)
			temp = object.toString();
		return temp;
	}

	/**
	 * @Description 日期转换，Date转Calendar处理
	 */
	public static int toDate(Date date) {
		// 直接从date获取年月日的方法已经过期了,所以要先转换为C
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		int y = cal.get(Calendar.YEAR);// 获取年份
		int m = cal.get(Calendar.MONTH) + 1;// 获取月份
		int d = cal.get(Calendar.DATE);// 获取日
		int i = 0;
		int s = 0;
		for (i = 1900; i < y; i++) {
			s += 365;
			// 闰年：能被4整除，但不能被100整除，或能被100整除，又能被400整除。
			if (i % 4 == 0 && i % 100 != 0 || i % 100 == 0 && i % 400 == 0)
				s++;
		}
		List<Integer> mouth = new ArrayList();
		mouth.add(0);
		mouth.add(31);
		mouth.add(28);
		mouth.add(31);
		mouth.add(30);
		mouth.add(31);
		mouth.add(30);
		mouth.add(31);
		mouth.add(31);
		mouth.add(30);
		mouth.add(31);
		mouth.add(30);
		mouth.add(31);
		if (y % 4 == 0 && y % 100 != 0 || y % 100 == 0 && y % 400 == 0)
			mouth.set(2, 29);
		for (i = 1; i < m; i++)
			s += mouth.get(i);
		if (y == 1900 && (m == 1 || m == 2))
			// 这是一个诡异的地方,其他年份都可以,就1900年1月份和2月份多出来一天
			return s + d;
		else
			return s + d + 1;
	}
	
	/**
	 * @Description 复制合并单元格
	 */
	public static void copyMergedRegion(Workbook fromWb, Workbook toWb, HSSFSheet fromSheet, HSSFSheet toSheet,
			int fromStart, int fromEnd, int toStart) {
		int differ = toStart - fromStart;
		int numOfMergedRegions = fromSheet.getNumMergedRegions();// 合并单元格的个数
		int firstRow = 0;
		int lastRow = 0;
		int firstCol = 0;
		int lastCol = 0;
		for (int i = 0; i < numOfMergedRegions; i++) {
			firstRow = fromSheet.getMergedRegion(i).getFirstRow();
			lastRow = fromSheet.getMergedRegion(i).getLastRow();
			firstCol = fromSheet.getMergedRegion(i).getFirstColumn();
			lastCol = fromSheet.getMergedRegion(i).getLastColumn();
			toSheet.addMergedRegion(new CellRangeAddress(firstRow + differ, lastRow + differ, firstCol, lastCol));
		}
	}

	public static void cleanBlank(Workbook wb, HSSFSheet sheet, int startRow, int endRow, int startCol, int endCol) {
		// EXPRESS.
		CellStyle style = wb.createCellStyle();
		int horizontal = endRow - startRow;
		int vertical = endCol - startCol;
		for (int i = 0; i <= horizontal; i++)
			if (sheet.getRow(startRow + i) != null)
				for (int j = 0; j <= vertical; j++)
					if (sheet.getRow(startRow + i).getCell(startCol + j) != null) {
						sheet.getRow(startRow + i).getCell(startCol + j).setCellStyle(style);
						sheet.getRow(startRow + i).getCell(startCol + j).setCellType(Cell.CELL_TYPE_BLANK);
					}
	}
	
	public boolean isEmptyRow(Row row) {
		boolean isEmpty = false;
		if (row == null)
			isEmpty = true;
		else
			for (Cell cell : row)
				if ("".equals(getValue(cell).trim()))
					isEmpty = true;
		
		return isEmpty;
	}
	
	// 只要没有数据,就判断为空行,不管它是不是有格式,而poi自带的row == null,指的是既没有数据又没有格式Style
	public boolean isEmptyDataRow(Row hssfRow) {
		int temp = 0;
		boolean isEmptyRow = false;
		if (hssfRow == null)
			isEmptyRow = true;
		else {
			for (int i = 0; i <= hssfRow.getLastCellNum(); i++)
				if (hssfRow.getCell(i) != null)
					if (getValue(hssfRow.getCell(i)) != null && !"".equals(getValue(hssfRow.getCell(i))))
						temp++;
			if (temp == 0)
				isEmptyRow = true;
		}
		return isEmptyRow;
	}
	
	/**
	 * 复制一个单元格样式到目的单元格样式
	 *
	 * @param fromStyle
	 * @param toStyle
	 */
	public static void copyCellStyle(HSSFCellStyle fromStyle, HSSFCellStyle toStyle) {
		toStyle.setAlignment(fromStyle.getAlignment());
		// 边框和边框颜色
		toStyle.setBorderBottom(fromStyle.getBorderBottom());
		toStyle.setBorderLeft(fromStyle.getBorderLeft());
		toStyle.setBorderRight(fromStyle.getBorderRight());
		toStyle.setBorderTop(fromStyle.getBorderTop());
		toStyle.setTopBorderColor(fromStyle.getTopBorderColor());
		toStyle.setBottomBorderColor(fromStyle.getBottomBorderColor());
		toStyle.setRightBorderColor(fromStyle.getRightBorderColor());
		toStyle.setLeftBorderColor(fromStyle.getLeftBorderColor());
		
		// 背景和前景
		toStyle.setFillBackgroundColor(fromStyle.getFillBackgroundColor());
		toStyle.setFillForegroundColor(fromStyle.getFillForegroundColor());
		
		toStyle.setDataFormat(fromStyle.getDataFormat());
		toStyle.setFillPattern(fromStyle.getFillPattern());
		// toStyle.setFont(fromStyle.getFont(null));
		toStyle.setHidden(fromStyle.getHidden());
		toStyle.setIndention(fromStyle.getIndention());// 首行缩进
		toStyle.setLocked(fromStyle.getLocked());
		toStyle.setRotation(fromStyle.getRotation());// 旋转
		toStyle.setVerticalAlignment(fromStyle.getVerticalAlignment());
		toStyle.setWrapText(fromStyle.getWrapText());
		
	}
	
	/**
	 * Sheet复制
	 *
	 * @param fromSheet
	 * @param toSheet
	 * @param copyValueFlag
	 */
	public static void copySheet(HSSFWorkbook wb, HSSFSheet fromSheet, HSSFSheet toSheet, boolean copyValueFlag) {
		// 合并区域处理
		mergerRegion(fromSheet, toSheet);
		int maxColumnNum = 0;
		for (Iterator rowIt = fromSheet.rowIterator(); rowIt.hasNext();) {
			HSSFRow tmpRow = (HSSFRow) rowIt.next();
			HSSFRow newRow = toSheet.createRow(tmpRow.getRowNum());
			// 行复制
			copyRow(wb, tmpRow, newRow, copyValueFlag);
			// 设置行高
			newRow.setHeight(tmpRow.getHeight());
			maxColumnNum = tmpRow.getLastCellNum();
		}
		// 设置目标sheet的列宽
		for (int i = 0; i <= maxColumnNum; i++)
			toSheet.setColumnWidth(i, fromSheet.getColumnWidth(i));
		
	}
	
	/**
	 * 行复制功能
	 *
	 * @param fromRow
	 * @param toRow
	 */
	public static void copyRow(HSSFWorkbook wb, HSSFRow fromRow, HSSFRow toRow, boolean copyValueFlag) {
		for (Iterator cellIt = fromRow.cellIterator(); cellIt.hasNext();) {
			HSSFCell tmpCell = (HSSFCell) cellIt.next();
			HSSFCell newCell = toRow.createCell(tmpCell.getCellNum());
			copyCell(wb, tmpCell, newCell, copyValueFlag);
		}
	}
	
	/**
	 * 复制原有sheet的合并单元格到新创建的sheet
	 *
	 * @param sheetCreat
	 *            新创建sheet
	 * @param sheet
	 *            原有的sheet
	 */
	public static void mergerRegion(HSSFSheet fromSheet, HSSFSheet toSheet) {
		int sheetMergerCount = fromSheet.getNumMergedRegions();
		for (int i = 0; i < sheetMergerCount; i++) {
			Region mergedRegionAt = fromSheet.getMergedRegionAt(i);
			toSheet.addMergedRegion(mergedRegionAt);
		}
	}
	
	/**
	 * 复制单元格
	 *
	 * @param srcCell
	 * @param distCell
	 * @param copyValueFlag
	 *            true则连同cell的内容一起复制
	 */
	public static void copyCell(HSSFWorkbook wb, HSSFCell srcCell, HSSFCell distCell, boolean copyValueFlag) {
		HSSFCellStyle newstyle = srcCell.getCellStyle();
		copyCellStyle(srcCell.getCellStyle(), newstyle);
		// 样式
		distCell.setCellStyle(newstyle);
		// 评论
		if (srcCell.getCellComment() != null)
			distCell.setCellComment(srcCell.getCellComment());
		// 不同数据类型处理
		int srcCellType = srcCell.getCellType();
		distCell.setCellType(srcCellType);
		if (copyValueFlag)
			if (srcCellType == Cell.CELL_TYPE_NUMERIC) {
				if (DateUtil.isCellDateFormatted(srcCell))
					distCell.setCellValue(srcCell.getDateCellValue());
				else
					distCell.setCellValue(srcCell.getNumericCellValue());
			} else if (srcCellType == Cell.CELL_TYPE_STRING)
				distCell.setCellValue(srcCell.getRichStringCellValue());
			else if (srcCellType == Cell.CELL_TYPE_BLANK) {
				// nothing21
			} else if (srcCellType == Cell.CELL_TYPE_BOOLEAN)
				distCell.setCellValue(srcCell.getBooleanCellValue());
			else if (srcCellType == Cell.CELL_TYPE_ERROR)
				distCell.setCellErrorValue(srcCell.getErrorCellValue());
			else if (srcCellType == Cell.CELL_TYPE_FORMULA)
				distCell.setCellFormula(srcCell.getCellFormula());
			else { // nothing29
			}
	}
	
	public static void writePicture(HSSFSheet sheet, HSSFWorkbook wb, Map pictureMap, String path, short col1,
			int row1, short col2, int row2) {
		HSSFPatriarch patriarch = sheet.createDrawingPatriarch();
		BufferedImage bufferImg = null;
		ByteArrayOutputStream byteArrayOut = new ByteArrayOutputStream();
		try {
			File file = new File(path + (String) pictureMap.get("file_path"), (String) pictureMap.get("file_id") + "."
					+ (String) pictureMap.get("file_extension"));
			if (file != null && file.exists() && file.isFile()) {
				bufferImg = ImageIO.read(file);
				ImageIO.write(bufferImg, (String) pictureMap.get("file_extension"), byteArrayOut);
				HSSFClientAnchor anchor = new HSSFClientAnchor(0, 0, 0, 0, col1, row1, col2, row2);
				patriarch.createPicture(anchor, wb.addPicture(byteArrayOut.toByteArray(), Workbook.PICTURE_TYPE_JPEG));
			}
		} catch (IOException e) {
			if (byteArrayOut != null)
				try {
					byteArrayOut.close();
					byteArrayOut = null;
				} catch (IOException e1) {
				}
			if (bufferImg != null)
				bufferImg = null;
			if (patriarch != null) {
				patriarch.clear();
				patriarch = null;
			}
		}
	}
	
	/**
	 * Excel 2003
	 */
	private final static String XLS = "xls";
	/**
	 * Excel 2007
	 */
	private final static String XLSX = "xlsx";
	/**
	 * 分隔符
	 */
	private final static String SEPARATOR = "|";
	
	public static List<String> exportListFromExcel(File file, int sheetNum) throws IOException {
		return exportListFromExcel(new FileInputStream(file), FilenameUtils.getExtension(file.getName()), sheetNum);
	}
	
	public static List<String> exportListFromExcel(InputStream is, String extensionName, int sheetNum)
			throws IOException {
		
		Workbook workbook = null;
		
		if (extensionName.toLowerCase().equals(XLS))
			workbook = new HSSFWorkbook(is);
		else if (extensionName.toLowerCase().equals(XLSX))
			workbook = new XSSFWorkbook(is);
		
		return exportListFromExcel(workbook, sheetNum);
	}
	
	private static List exportListFromExcel(Workbook workbook, int sheetNum) {
		
		Sheet sheet = workbook.getSheetAt(sheetNum);
		DecimalFormat df = new DecimalFormat("#");
		// 解析公式结果
		FormulaEvaluator evaluator = workbook.getCreationHelper().createFormulaEvaluator();
		
		List list = new ArrayList();
		
		int minRowIx = sheet.getFirstRowNum();
		int maxRowIx = sheet.getLastRowNum();
		if (minRowIx < 0)
			return list;
		for (int rowIx = minRowIx; rowIx <= maxRowIx; rowIx++) {
			List dataList = new ArrayList();
			Row row = sheet.getRow(rowIx);
			if (row == null)
				continue;
			StringBuilder sb = new StringBuilder();
			
			short minColIx = row.getFirstCellNum();
			short maxColIx = row.getLastCellNum();
			if (minColIx < 0)
				continue;
			for (short colIx = minColIx; colIx <= maxColIx; colIx++) {
				Cell cell = row.getCell(new Integer(colIx));
				CellValue cellValue = evaluator.evaluate(cell);
				if (cellValue == null) {
					sb.append(SEPARATOR + " ");
					dataList.add(" ");
					continue;
				}
				// 经过公式解析，最后只存在Boolean、Numeric和String三种数据类型，此外就是Error了
				// 其余数据类型，根据官方文档，完全可以忽略http://poi.apache.org/spreadsheet/eval.html
				switch (cellValue.getCellType()) {
					case Cell.CELL_TYPE_BOOLEAN:
						sb.append(SEPARATOR + cellValue.getBooleanValue());
						dataList.add(cellValue.getBooleanValue());
						break;
					case Cell.CELL_TYPE_NUMERIC:
						// 这里的日期类型会被转换为数字类型，需要判别后区分处理
						if (DateUtil.isCellDateFormatted(cell)) {
							sb.append(SEPARATOR + cell.getDateCellValue());
							dataList.add(cell.getDateCellValue());
						} else {
							sb.append(SEPARATOR + df.format(cellValue.getNumberValue()));
							dataList.add(df.format(cellValue.getNumberValue()));
						}
						break;
					case Cell.CELL_TYPE_STRING:
						sb.append(SEPARATOR + cellValue.getStringValue());
						dataList.add(cellValue.getStringValue());
						break;
					default:
						sb.append("");
						dataList.add("");
						break;
				}
			}
			if (sb != null && !sb.toString().replace("|", "").trim().equals(""))
				list.add(dataList);
		}
		return list;
	}
	
	public static HSSFWorkbook listToExcel(List list, String[] header) throws SysException {
		List headers = new ArrayList();
		if (header != null && header.length > 0)
			headers.add(header);
		return listToExcel(list, headers);
	}
	
	public static HSSFWorkbook listToExcel(List list, List<String[]> headers) throws SysException {
		HSSFWorkbook hssfWorkbook = new HSSFWorkbook();
		HSSFSheet sheet = hssfWorkbook.createSheet();
		int columns = 0;
		if (headers != null && headers.size() > 0)
			for (String[] propertyName : headers) {
				if (propertyName == null)
					throw new SysException("EXCEL表头为空");
				HSSFRow row = sheet.createRow(columns);
				for (int i = 0; i < propertyName.length; i++) {
					HSSFCell cell = row.createCell(i);
					cell.setCellValue(propertyName[i]);
				}
				columns++;
			}
		if (list != null && list.size() > 0)
			for (int i = 0; i < list.size(); i++) {
				HSSFRow rowMap = sheet.createRow(columns);
				Map map = (Map) list.get(i);
				if (map != null) {
					Iterator<Map.Entry> entries = map.entrySet().iterator();
					int index = 0;
					while (entries.hasNext()) {
						Map.Entry entry = entries.next();
						HSSFCell cell = rowMap.createCell(index);
						cell.setCellType(Cell.CELL_TYPE_STRING);
						Object cellValue = entry.getValue();
						cell.setCellValue(StringUtil.obj2String(cellValue));
						/*
						 * if (cellValue != null) { if (cellValue.getClass().equals(Date.class)) {
						 * SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
						 * cell.setCellValue(df.format(cellValue)); } else
						 * cell.setCellValue(cellValue.toString()); } else cell.setCellValue("");
						 */
						index++;
					}
				}
				columns++;
			}
		if (headers != null && headers.size() > 0)
			/* 自动调整宽度 */
			for (int i = 0; i < headers.get(headers.size() - 1).length; i++) {
				sheet.autoSizeColumn(i);
				if (sheet.getColumnWidth(i) > 2000 * 12)
					sheet.setColumnWidth(i, 2000 * 12);
			}
		/* 实际宽度 */
		// int curColWidth = 0;
		/*
		 * 默认宽度 int[] defaultColWidth = { 2000, 2000, 2000, 3000, 3000, 2000 }; 实际宽度 <
		 * 默认宽度的时候、设置为默认宽度 for (int i = 0; i < headers.get(headers.size() - 1).length; i++) {
		 * curColWidth = sheet.getColumnWidth(i); if (curColWidth < defaultColWidth[i]) {
		 * sheet.setColumnWidth(i, defaultColWidth[i]); } }
		 */
		return hssfWorkbook;
	}

	public static void setPrintSet(HSSFSheet hssfSheet) {
		HSSFPrintSetup ps = hssfSheet.getPrintSetup();
		ps.setLandscape(false); // 打印方向，true：横向，false：纵向
		ps.setPaperSize(PrintSetup.A4_PAPERSIZE); // 纸张
		hssfSheet.setMargin(Sheet.BottomMargin, 0.5);// 页边距（下）
		hssfSheet.setMargin(Sheet.LeftMargin, 0.1);// 页边距（左）
		hssfSheet.setMargin(Sheet.RightMargin, 0.1);// 页边距（右）
		hssfSheet.setMargin(Sheet.TopMargin, 0.5);// 页边距（上）
		hssfSheet.setHorizontallyCenter(true);// 设置打印页面为水平居中
		hssfSheet.setVerticallyCenter(true);// 设置打印页面为垂直居中
	}
}
