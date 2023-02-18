package pageModel;

import java.util.Date;

public class Scripture {
	private String scripture_no   ;
	private String scripture_text ;
	private String url            ;
	private Date create_date    ;
	private Date update_date    ;
	private String type ;
	public String getScripture_no() {
		return scripture_no;
	}
	public void setScripture_no(String scripture_no) {
		this.scripture_no = scripture_no;
	}
	public String getScripture_text() {
		return scripture_text;
	}
	public void setScripture_text(String scripture_text) {
		this.scripture_text = scripture_text;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public Date getCreate_date() {
		return create_date;
	}
	public void setCreate_date(Date create_date) {
		this.create_date = create_date;
	}
	public Date getUpdate_date() {
		return update_date;
	}
	public void setUpdate_date(Date update_date) {
		this.update_date = update_date;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}

}
