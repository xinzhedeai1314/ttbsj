package pageModel;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/** 
 *  
 * @ClassName GridObj
 * @Description 
 * Copyright (c) 2014 by NS Soft. 
 * @author xuliguo   
 * @date 2014年12月12日 下午4:02:47    
 * @version V1.0        
 *        
 */
@SuppressWarnings("rawtypes")
public class GridObj {
	private int results = 0;
	private List rows =  new ArrayList();
	private Boolean hasError = false;
	private String error = null;
	private Map summary = null;
	
	public Boolean getHasError() {
		return hasError;
	}
	public void setHasError(Boolean hasError) {
		this.hasError = hasError;
	}
	public String getError() {
		return error;
	}
	public void setError(String error) {
		this.error = error;
	}
	public int getResults() {
		return results;
	}
	public void setResults(int results) {
		this.results = results;
	}
	public List getRows() {
		return rows;
	}
	public void setRows(List rows) {
		this.rows = rows;
	}
	public Map getSummary() {
		return summary;
	}
	public void setSummary(Map summary) {
		this.summary = summary;
	}
	public GridObj() {
	}
	public GridObj(int results, List rows) {
		this.results = results;
		this.rows = rows;
	}
	public GridObj(int results, List rows, Boolean hasError, String error) {
		this.results = results;
		this.rows = rows;
		this.hasError = hasError;
		this.error = error;
	}
	public GridObj(int results, List rows, Boolean hasError, String error,
			Map summary) {
		this.results = results;
		this.rows = rows;
		this.hasError = hasError;
		this.error = error;
		this.summary = summary;
	}
	@Override
	public String toString() {
		return "GridObj [results=" + results + ", rows=" + rows + ", hasError="
				+ hasError + ", error=" + error + ", summary=" + summary + "]";
	}
	
	
}
