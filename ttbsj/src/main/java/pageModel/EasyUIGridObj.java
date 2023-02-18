package pageModel;

import java.util.List;
import java.util.Map;

/**   
 *
 * @ClassName EasyUIGridObj
 * @Description
 * Copyright (c) 2014 by NS Soft. 
 * @author xuliguo   
 * @date 2015年7月31日 上午10:17:10    
 * @version V1.0      
 *    
 */
@SuppressWarnings("rawtypes")
public class EasyUIGridObj {
	
	private long total;
	private List rows;
	private Map summary = null;
	
	public Map getSummarys() {
		return summary;
	}
	public void setSummarys(Map summarys) {
		this.summary = summarys;
	}
	public long getTotal() {
		return total;
	}
	public void setTotal(long total) {
		this.total = total;
	}
	public List getRows() {
		return rows;
	}
	public void setRows(List rows) {
		this.rows = rows;
	}
	
	public EasyUIGridObj() {
		
	}
	
	public EasyUIGridObj(int total, List rows, Map summary) {
		this.total = total;
		this.rows = rows;
		this.summary = summary;
	}
	
	@Override
	public String toString() {
		return "EasyUIGridObj [total=" + total + ", rows=" + rows
				+ ", summarys=" + summary + "]";
	}
	
}
