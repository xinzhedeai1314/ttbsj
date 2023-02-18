package exception;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

//import normalPo.Scripture;
import pageModel.JsonResult;
import util.RequestUtil;
import util.SpringUtils;

@Controller
@RequestMapping("/errorAction")
public class Error extends Exception{
	@ResponseBody
	@RequestMapping("/error")
	public JsonResult error(HttpServletRequest req, HttpServletResponse res) throws Exception {
		boolean isAjaxRequest = RequestUtil.isAjaxRequest(req);
		if (isAjaxRequest) {
			throw new Exception();
		} else {
			try {
				res.sendRedirect(req.getContextPath() + "/error/error.html");
			} catch (IOException e) {
				e.printStackTrace();
			}
			return null;
		}
	}
}
