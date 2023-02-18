package customMapper;

import java.util.List;
import java.util.Map;

import pageModel.Scripture;
import tk.mybatis.mapper.common.Mapper;
@SuppressWarnings("rawtypes")
public interface CustomScriptureMapper extends Mapper{
	int insertScripture(Map map);

	Integer searchScripturesByDate(Map paramMap);

	String selectLastDate(Map paramMap);

	int insertScriptureByManual(Map paramMap);

	Integer selectLastScriptureNo(Map paramMap);

	int modScripture(Map paramMap);

	Map getNextScriptureDate(Map paramMap);

	List<Scripture> searchScriptures(Map paramMap);

	List getScriptureByBible(Map paramMap);
	
	List getVolumeChapterVerse(Map paramMap);

	Map getPrevScripture(Map paramMap);
	
}
