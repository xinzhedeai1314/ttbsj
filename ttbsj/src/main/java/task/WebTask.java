package task;

import org.apache.ibatis.session.SqlSession;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**  
 * @Description
 * @author xuliguo
 * @date 2015年9月8日 下午11:30:27
 */
@SuppressWarnings("rawtypes")
@Component
public class WebTask {
	
	@Scheduled(cron = "0/5 * * * * ?")
	public void goTask() {
		 System.out.println("test second annotation style ...");
	}

}
