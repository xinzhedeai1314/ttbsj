package pageModel;

/**
 * 用户身份信息，存入session
 * 由于tomcat将session会序列化在本地硬盘上，所以使用Serializable接口
 * @author Thinkpad
 *
 */
public class ActiveUser  implements java.io.Serializable {

	private String userid;//用户id
	private String username;//用户名称
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getUserid() {
		return userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
	}
}
