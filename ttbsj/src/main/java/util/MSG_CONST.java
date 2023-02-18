package util;

public enum MSG_CONST {
	ADDSUCCESS("添加成功", 100),
	ADDFAIL("添加失败", 101),
	UPDATESUCCESS("更新成功", 200),
	UPDATEFAIL("更新失败", 201),
	DELETESUCCESS("删除成功", 300),
	DELETEFAIL("删除失败", 301),
	READSUCCESS("读取成功", 400),
	READFAIL("读取失败", 401);
	
	
	private String name;
	private int index;

	private MSG_CONST(String name, int index){
		this.name = name;
		this.index = index;
	}
	 public String getValue() {
        return name;
    }
	 @Override
	public String toString() {//重写该枚举类的toString方法
		return getValue();
	}
}

