package pageModel;

import com.alibaba.fastjson.support.spring.FastJsonJsonView;

import util.MSG_CONST;

/**
 * 
 * JSON模型
 * 
 * 用户后台向前台返回的JSON对象
 * 
 * @author 孙宇
 * 
 */
public class JsonResult implements java.io.Serializable {

	private boolean success = false;

	private String msg = "";

	private Object result = null;
	
	
	public boolean isSuccess() {
		return success;
	}

	public void setSuccess(boolean success) {
		this.success = success;
	}

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}

	public Object getResult() {
		return result;
	}

	public void setResult(Object result) {
		this.result = result;
	}

	public void setMsg(MSG_CONST msg) {
		this.msg = msg.getValue();
	}

}
