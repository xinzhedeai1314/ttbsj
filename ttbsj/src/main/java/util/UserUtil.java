package util;

import javax.servlet.http.HttpSession;

import pageModel.ActiveUser;

/**
 * 用户身份信息工具类
 *
 * @author mrt
 */
public class UserUtil {

    public static final String USER = "activeUser";

    /**
     * 设置用户到session
     *
     * @param session
     * @param user
     */
    public static void saveUserToSession(HttpSession session, ActiveUser activeUser) {
        session.setAttribute(USER, activeUser);
    }

    /**
     * 从Session获取当前用户信息
     *
     * @param session
     * @return
     */
    public static ActiveUser getUserFromSession(HttpSession session) {
        Object attribute = session.getAttribute(USER);
        return attribute == null ? null : (ActiveUser) attribute;
    }

}
