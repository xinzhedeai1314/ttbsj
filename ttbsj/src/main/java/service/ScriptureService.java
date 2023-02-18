package service;

import java.util.List;
import java.util.Map;

import exception.SysException;
import pageModel.EasyUIGridObj;
import pageModel.Scripture;
@SuppressWarnings("rawtypes")
public interface ScriptureService {
	
	public int insertScripture(Map map);

	public Integer searchScripturesByDate(Map paramMap);

	public List<Scripture> searchScriptures(Map paramMap);
}
