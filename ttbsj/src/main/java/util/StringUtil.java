package util;



import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.security.SecureRandom;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;


import net.sourceforge.pinyin4j.PinyinHelper;
import net.sourceforge.pinyin4j.format.HanyuPinyinCaseType;
import net.sourceforge.pinyin4j.format.HanyuPinyinOutputFormat;
import net.sourceforge.pinyin4j.format.HanyuPinyinToneType;
import net.sourceforge.pinyin4j.format.exception.BadHanyuPinyinOutputFormatCombination;

public class StringUtil {
    /**
     * 空字符串 <code>""</code>.
     */
    public static final String EMPTY = "";

    /**
     * <p>Padding을 할 수 있는 최대 수치</p>
     */
    // private static final int PAD_LIMIT = 8192;

    /**
     * <p>An array of <code>String</code>s used for padding.</p>
     * <p>Used for efficient space padding. The length of each String expands as needed.</p>
     */
    /*
	private static final String[] PADDING = new String[Character.MAX_VALUE];

	static {
		// space padding is most common, start with 64 chars
		PADDING[32] = "                                                                ";
	}
     */
    public static String cutString(String source, String output, int slength) {
        String returnVal = null;
        if (source != null) {
            if (source.length() > slength) {
                returnVal = source.substring(0, slength) + output;
            } else
                returnVal = source;
        }
        return returnVal;
    }

    public static String cutString(String source, int slength) {
        String result = null;
        if (source != null) {
            if (source.length() > slength) {
                result = source.substring(0, slength);
            } else
                result = source;
        }
        return result;
    }

    public static boolean isEmpty(String str) {
        return str == null || str.length() == 0;
    }

    
    public static String remove(String str, char remove) {
        if (isEmpty(str) || str.indexOf(remove) == -1) {
            return str;
        }
        char[] chars = str.toCharArray();
        int pos = 0;
        for (int i = 0; i < chars.length; i++) {
            if (chars[i] != remove) {
                chars[pos++] = chars[i];
            }
        }
        return new String(chars, 0, pos);
    }

    public static String removeCommaChar(String str) {
        return remove(str, ',');
    }

    public static String removeMinusChar(String str) {
        return remove(str, '-');
    }


    public static String replace(String source, String subject, String object) {
        StringBuffer rtnStr = new StringBuffer();
        String preStr = "";
        String nextStr = source;
        String srcStr  = source;

        while (srcStr.indexOf(subject) >= 0) {
            preStr = srcStr.substring(0, srcStr.indexOf(subject));
            nextStr = srcStr.substring(srcStr.indexOf(subject) + subject.length(), srcStr.length());
            srcStr = nextStr;
            rtnStr.append(preStr).append(object);
        }
        rtnStr.append(nextStr);
        return rtnStr.toString();
    }

    public static String replaceOnce(String source, String subject, String object) {
        StringBuffer rtnStr = new StringBuffer();
        String preStr = "";
        String nextStr = source;
        if (source.indexOf(subject) >= 0) {
            preStr = source.substring(0, source.indexOf(subject));
            nextStr = source.substring(source.indexOf(subject) + subject.length(), source.length());
            rtnStr.append(preStr).append(object).append(nextStr);
            return rtnStr.toString();
        } else {
            return source;
        }
    }

    public static String replaceChar(String source, String subject, String object) {
        StringBuffer rtnStr = new StringBuffer();
        String preStr = "";
        String nextStr = source;
        String srcStr  = source;

        char chA;

        for (int i = 0; i < subject.length(); i++) {
            chA = subject.charAt(i);

            if (srcStr.indexOf(chA) >= 0) {
                preStr = srcStr.substring(0, srcStr.indexOf(chA));
                nextStr = srcStr.substring(srcStr.indexOf(chA) + 1, srcStr.length());
                srcStr = rtnStr.append(preStr).append(object).append(nextStr).toString();
            }
        }

        return srcStr;
    }

    /**
     * <p><code>str</code> 중 <code>searchStr</code>의 시작(index) 위치를 반환.</p>
     *
     * <p>입력값 중 <code>null</code>이 있을 경우 <code>-1</code>을 반환.</p>
     *
     * <pre>
     * StringUtil.indexOf(null, *)          = -1
     * StringUtil.indexOf(*, null)          = -1
     * StringUtil.indexOf("", "")           = 0
     * StringUtil.indexOf("aabaabaa", "a")  = 0
     * StringUtil.indexOf("aabaabaa", "b")  = 2
     * StringUtil.indexOf("aabaabaa", "ab") = 1
     * StringUtil.indexOf("aabaabaa", "")   = 0
     * </pre>
     *
     * @param str  검색 문자열
     * @param searchStr  검색 대상문자열
     * @return 검색 문자열 중 검색 대상문자열이 있는 시작 위치 검색대상 문자열이 없거나 null인 경우 -1
     */
    public static int indexOf(String str, String searchStr) {
        if (str == null || searchStr == null) {
            return -1;
        }
        return str.indexOf(searchStr);
    }


    /**
     * <p>오라클의 decode 함수와 동일한 기능을 가진 메서드이다.
     * <code>sourStr</code>과 <code>compareStr</code>의 값이 같으면
     * <code>returStr</code>을 반환하며, 다르면  <code>defaultStr</code>을 반환한다.
     * </p>
     *
     * <pre>
     * StringUtil.decode(null, null, "foo", "bar")= "foo"
     * StringUtil.decode("", null, "foo", "bar") = "bar"
     * StringUtil.decode(null, "", "foo", "bar") = "bar"
     * StringUtil.decode("하이", "하이", null, "bar") = null
     * StringUtil.decode("하이", "하이  ", "foo", null) = null
     * StringUtil.decode("하이", "하이", "foo", "bar") = "foo"
     * StringUtil.decode("하이", "하이  ", "foo", "bar") = "bar"
     * </pre>
     *
     * @param sourceStr 비교할 문자열
     * @param compareStr 비교 대상 문자열
     * @param returnStr sourceStr와 compareStr의 값이 같을 때 반환할 문자열
     * @param defaultStr sourceStr와 compareStr의 값이 다를 때 반환할 문자열
     * @return sourceStr과 compareStr의 값이 동일(equal)할 때 returnStr을 반환하며,
     *         <br/>다르면 defaultStr을 반환한다.
     */
    public static String decode(String sourceStr, String compareStr, String returnStr, String defaultStr) {
        if (sourceStr == null && compareStr == null) {
            return returnStr;
        }

        if (sourceStr == null && compareStr != null) {
            return defaultStr;
        }

        if (sourceStr.trim().equals(compareStr)) {
            return returnStr;
        } 

        return defaultStr;
    }

    /**
     * <p>오라클의 decode 함수와 동일한 기능을 가진 메서드이다.
     * <code>sourStr</code>과 <code>compareStr</code>의 값이 같으면
     * <code>returStr</code>을 반환하며, 다르면  <code>sourceStr</code>을 반환한다.
     * </p>
     *
     * <pre>
     * StringUtil.decode(null, null, "foo") = "foo"
     * StringUtil.decode("", null, "foo") = ""
     * StringUtil.decode(null, "", "foo") = null
     * StringUtil.decode("하이", "하이", "foo") = "foo"
     * StringUtil.decode("하이", "하이 ", "foo") = "하이"
     * StringUtil.decode("하이", "바이", "foo") = "하이"
     * </pre>
     *
     * @param sourceStr 비교할 문자열
     * @param compareStr 비교 대상 문자열
     * @param returnStr sourceStr와 compareStr의 값이 같을 때 반환할 문자열
     * @return sourceStr과 compareStr의 값이 동일(equal)할 때 returnStr을 반환하며,
     *         <br/>다르면 sourceStr을 반환한다.
     */
    public static String decode(String sourceStr, String compareStr, String returnStr) {
        return decode(sourceStr, compareStr, returnStr, sourceStr);
    }

    public static String isNullToString(Object object) {
        String string = "";

        if (object != null) {
            string = object.toString().trim();
        }

        return string;
    }

    public static String nullConvert(Object src) {
		if (src != null && src instanceof java.math.BigDecimal) {
		    return ((BigDecimal)src).toString();
		}
	
		if (src == null || src.equals("null")) {
		    return "";
		} else {
		    return ((String)src).trim();
		}
    }

    public static String nullConvert(String src) {

		if (src == null || src.equals("null") || "".equals(src) || " ".equals(src)) {
		    return "";
		} else {
		    return src.trim();
		}
    }

    public static int zeroConvert(Object src) {
		if (src == null || src.equals("null")) {
		    return 0;
		} else {
		    return Integer.parseInt(((String)src).trim());
		}
    }

    public static int zeroConvert(String src) {

		if (src == null || src.equals("null") || "".equals(src) || " ".equals(src)) {
		    return 0;
		} else {
		    return Integer.parseInt(src.trim());
		}
    }

    public static String removeWhitespace(String str) {
        if (isEmpty(str)) {
            return str;
        }
        int sz = str.length();
        char[] chs = new char[sz];
        int count = 0;
        for (int i = 0; i < sz; i++) {
            if (!Character.isWhitespace(str.charAt(i))) {
                chs[count++] = str.charAt(i);
            }
        }
        if (count == sz) {
            return str;
        }

        return new String(chs, 0, count);
    }

    /**
     * Html 코드가 들어간 문서를 표시할때 태그에 손상없이 보이기 위한 메서드
     *
     * @param strString
     * @return HTML 태그를 치환한 문자열
     */
    public static String checkHtmlView(String strString) {
		String strNew = "";
		StringBuffer strTxt = new StringBuffer("");
	
	    char chrBuff;
	    int len = strString.length();
	
	    for (int i = 0; i < len; i++) {
		chrBuff = strString.charAt(i);
	
		switch (chrBuff) {
		case '<':
		    strTxt.append("&lt;");
		    break;
		case '>':
		    strTxt.append("&gt;");
		    break;
		case '"':
		    strTxt.append("&quot;");
		    break;
		case 10:
		    strTxt.append("<br>");
		    break;
		case ' ':
		    strTxt.append("&nbsp;");
		    break;
		//case '&' :
		    //strTxt.append("&amp;");
		    //break;
		default:
		    strTxt.append(chrBuff);
		}
    }

    strNew = strTxt.toString();

	return strNew;
    }


    /**
     * 문자열을 지정한 분리자에 의해 배열로 리턴하는 메서드.
     * @param source 원본 문자열
     * @param separator 분리자
     * @return result 분리자로 나뉘어진 문자열 배열
     */
    public static String[] split(String source, String separator) throws NullPointerException {
        String[] returnVal = null;
        int cnt = 1;

        int index = source.indexOf(separator);
        int index0 = 0;
        while (index >= 0) {
            cnt++;
            index = source.indexOf(separator, index + 1);
        }
        returnVal = new String[cnt];
        cnt = 0;
        index = source.indexOf(separator);
        while (index >= 0) {
            returnVal[cnt] = source.substring(index0, index);
            index0 = index + 1;
            index = source.indexOf(separator, index + 1);
            cnt++;
        }
        returnVal[cnt] = source.substring(index0);

        return returnVal;
    }

    public static String lowerCase(String str) {
        if (str == null) {
            return null;
        }

        return str.toLowerCase();
    }
    
    public static String upperCase(String str) {
        if (str == null) {
            return null;
        }

        return str.toUpperCase();
    }

    /**
     * <p>입력된 String의 앞쪽에서 두번째 인자로 전달된 문자(stripChars)를 모두 제거한다.</p>
     *
     * <pre>
     * StringUtil.stripStart(null, *)          = null
     * StringUtil.stripStart("", *)            = ""
     * StringUtil.stripStart("abc", "")        = "abc"
     * StringUtil.stripStart("abc", null)      = "abc"
     * StringUtil.stripStart("  abc", null)    = "abc"
     * StringUtil.stripStart("abc  ", null)    = "abc  "
     * StringUtil.stripStart(" abc ", null)    = "abc "
     * StringUtil.stripStart("yxabc  ", "xyz") = "abc  "
     * </pre>
     *
     * @param str 지정된 문자가 제거되어야 할 문자열
     * @param stripChars 제거대상 문자열
     * @return 지정된 문자가 제거된 문자열, null이 입력되면 <code>null</code> 리턴
     */
    public static String stripStart(String str, String stripChars) {
        int strLen;
        if (str == null || (strLen = str.length()) == 0) {
            return str;
        }
        int start = 0;
        if (stripChars == null) {
            while ((start != strLen) && Character.isWhitespace(str.charAt(start))) {
                start++;
            }
        } else if (stripChars.length() == 0) {
            return str;
        } else {
            while ((start != strLen) && (stripChars.indexOf(str.charAt(start)) != -1)) {
                start++;
            }
        }

        return str.substring(start);
    }


    /**
     * <p>입력된 String의 뒤쪽에서 두번째 인자로 전달된 문자(stripChars)를 모두 제거한다.</p>
     *
     * <pre>
     * StringUtil.stripEnd(null, *)          = null
     * StringUtil.stripEnd("", *)            = ""
     * StringUtil.stripEnd("abc", "")        = "abc"
     * StringUtil.stripEnd("abc", null)      = "abc"
     * StringUtil.stripEnd("  abc", null)    = "  abc"
     * StringUtil.stripEnd("abc  ", null)    = "abc"
     * StringUtil.stripEnd(" abc ", null)    = " abc"
     * StringUtil.stripEnd("  abcyx", "xyz") = "  abc"
     * </pre>
     *
     * @param str 지정된 문자가 제거되어야 할 문자열
     * @param stripChars 제거대상 문자열
     * @return 지정된 문자가 제거된 문자열, null이 입력되면 <code>null</code> 리턴
     */
    public static String stripEnd(String str, String stripChars) {
        int end;
        if (str == null || (end = str.length()) == 0) {
            return str;
        }

        if (stripChars == null) {
            while ((end != 0) && Character.isWhitespace(str.charAt(end - 1))) {
                end--;
            }
        } else if (stripChars.length() == 0) {
            return str;
        } else {
            while ((end != 0) && (stripChars.indexOf(str.charAt(end - 1)) != -1)) {
                end--;
            }
        }

        return str.substring(0, end);
    }

    /**
     * <p>입력된 String의 앞, 뒤에서 두번째 인자로 전달된 문자(stripChars)를 모두 제거한다.</p>
     *
     * <pre>
     * StringUtil.strip(null, *)          = null
     * StringUtil.strip("", *)            = ""
     * StringUtil.strip("abc", null)      = "abc"
     * StringUtil.strip("  abc", null)    = "abc"
     * StringUtil.strip("abc  ", null)    = "abc"
     * StringUtil.strip(" abc ", null)    = "abc"
     * StringUtil.strip("  abcyx", "xyz") = "  abc"
     * </pre>
     *
     * @param str 지정된 문자가 제거되어야 할 문자열
     * @param stripChars 제거대상 문자열
     * @return 지정된 문자가 제거된 문자열, null이 입력되면 <code>null</code> 리턴
     */
    public static String strip(String str, String stripChars) {
		if (isEmpty(str)) {
		    return str;
		}
	
		String srcStr = str;
		srcStr = stripStart(srcStr, stripChars);
	
		return stripEnd(srcStr, stripChars);
    }

    /**
     * 문자열을 지정한 분리자에 의해 지정된 길이의 배열로 리턴하는 메서드.
     * @param source 원본 문자열
     * @param separator 분리자
     * @param arraylength 배열 길이
     * @return 분리자로 나뉘어진 문자열 배열
     */
    public static String[] split(String source, String separator, int arraylength) throws NullPointerException {
        String[] returnVal = new String[arraylength];
        int cnt = 0;
        int index0 = 0;
        int index = source.indexOf(separator);
        while (index >= 0 && cnt < (arraylength - 1)) {
            returnVal[cnt] = source.substring(index0, index);
            index0 = index + 1;
            index = source.indexOf(separator, index + 1);
            cnt++;
        }
        returnVal[cnt] = source.substring(index0);
        if (cnt < (arraylength - 1)) {
            for (int i = cnt + 1; i < arraylength; i++) {
                returnVal[i] = "";
            }
        }

        return returnVal;
    }

    /**
     * 문자열 A에서 Z사이의 랜덤 문자열을 구하는 기능을 제공 시작문자열과 종료문자열 사이의 랜덤 문자열을 구하는 기능
     *
     * @param startChr
     *            - 첫 문자
     * @param endChr
     *            - 마지막문자
     * @return 랜덤문자
     * @exception MyException
     * @see
     */
    public static String getRandomStr(char startChr, char endChr) throws Exception{

	int randomInt;
	String randomStr = null;

	// 시작문자 및 종료문자를 아스키숫자로 변환한다.
	int startInt = Integer.valueOf(startChr);
	int endInt = Integer.valueOf(endChr);

	// 시작문자열이 종료문자열보가 클경우
	if (startInt > endInt) {
	    throw new IllegalArgumentException("Start String: " + startChr + " End String: " + endChr);
	}
	
	// 랜덤 객체 생성
    SecureRandom rnd = new SecureRandom();

    do {
	// 시작문자 및 종료문자 중에서 랜덤 숫자를 발생시킨다.
	randomInt = rnd.nextInt(endInt + 1);
    } while (randomInt < startInt); // 입력받은 문자 'A'(65)보다 작으면 다시 랜덤 숫자 발생.

    // 랜덤 숫자를 문자로 변환 후 스트링으로 다시 변환
    randomStr = (char)randomInt + "";

//	try {
//	    // 랜덤 객체 생성
//	    SecureRandom rnd = new SecureRandom();
//
//	    do {
//		// 시작문자 및 종료문자 중에서 랜덤 숫자를 발생시킨다.
//		randomInt = rnd.nextInt(endInt + 1);
//	    } while (randomInt < startInt); // 입력받은 문자 'A'(65)보다 작으면 다시 랜덤 숫자 발생.
//
//	    // 랜덤 숫자를 문자로 변환 후 스트링으로 다시 변환
//	    randomStr = (char)randomInt + "";
//	} catch (Exception e) {
//	    //e.printStackTrace();
//	    throw e;	// 2011.10.10 보안점검 후속조치
//	}

	// 랜덤문자열를 리턴
	return randomStr;
    }

    /**
     * 문자열을 다양한 문자셋(EUC-KR[KSC5601],UTF-8..)을 사용하여 인코딩하는 기능 역으로 디코딩하여 원래의 문자열을
     * 복원하는 기능을 제공함 String temp = new String(문자열.getBytes("바꾸기전 인코딩"),"바꿀 인코딩");
     * String temp = new String(문자열.getBytes("8859_1"),"KSC5601"); => UTF-8 에서
     * EUC-KR
     *
     * @param srcString
     *            - 문자열
     * @param srcCharsetNm
     *            - 원래 CharsetNm
     * @param charsetNm
     *            - CharsetNm
     * @return 인(디)코딩 문자열
     * @exception MyException
     * @see
     */
    public static String getEncdDcd(String srcString, String srcCharsetNm, String cnvrCharsetNm) {

	String rtnStr = null;

	if (srcString == null)
	    return null;

	try {
	    rtnStr = new String(srcString.getBytes(srcCharsetNm), cnvrCharsetNm);
	} catch (UnsupportedEncodingException e) {
	    rtnStr = null;
	}

	return rtnStr;
    }

/**
     * 특수문자를 웹 브라우저에서 정상적으로 보이기 위해 특수문자를 처리('<' -> & lT)하는 기능이다
     * @param 	srcString 		- '<'
     * @return 	변환문자열('<' -> "&lt"
     * @exception MyException
     * @see
     */
    public static String getSpclStrCnvr(String srcString) throws Exception{

	String rtnStr = null;
	StringBuffer strTxt = new StringBuffer("");

    char chrBuff;
    int len = srcString.length();

    for (int i = 0; i < len; i++) {
	chrBuff = srcString.charAt(i);

	switch (chrBuff) {
	case '<':
	    strTxt.append("&lt;");
	    break;
	case '>':
	    strTxt.append("&gt;");
	    break;
	case '&':
	    strTxt.append("&amp;");
	    break;
	default:
	    strTxt.append(chrBuff);
	}
    }

    rtnStr = strTxt.toString();
//	try {
//	    StringBuffer strTxt = new StringBuffer("");
//
//	    char chrBuff;
//	    int len = srcString.length();
//
//	    for (int i = 0; i < len; i++) {
//		chrBuff = (char)srcString.charAt(i);
//
//		switch (chrBuff) {
//		case '<':
//		    strTxt.append("&lt;");
//		    break;
//		case '>':
//		    strTxt.append("&gt;");
//		    break;
//		case '&':
//		    strTxt.append("&amp;");
//		    break;
//		default:
//		    strTxt.append(chrBuff);
//		}
//	    }
//
//	    rtnStr = strTxt.toString();
//
//	} catch (Exception e) {
//	    //e.printStackTrace();
//	    throw e;	// 2011.10.10 보안점검 후속조치
//	}

	return rtnStr;
    }

    /**
     * html의 특수문자를 표현하기 위해
     *
     * @param srcString
     * @return String
     * @exception Exception
     * @see
     */
    public static String getHtmlStrCnvr(String srcString) throws Exception {

    	String tmpString = srcString;
    	tmpString = tmpString.replaceAll("&lt;", "<");
		tmpString = tmpString.replaceAll("&gt;", ">");
		tmpString = tmpString.replaceAll("&amp;", "&");
		tmpString = tmpString.replaceAll("&nbsp;", " ");
		tmpString = tmpString.replaceAll("&apos;", "\'");
		tmpString = tmpString.replaceAll("&quot;", "\"");

//		try
//		{
//			tmpString = tmpString.replaceAll("&lt;", "<");
//			tmpString = tmpString.replaceAll("&gt;", ">");
//			tmpString = tmpString.replaceAll("&amp;", "&");
//			tmpString = tmpString.replaceAll("&nbsp;", " ");
//			tmpString = tmpString.replaceAll("&apos;", "\'");
//			tmpString = tmpString.replaceAll("&quot;", "\"");
//		}
//		catch (Exception ex)
//		{
//		    //ex.printStackTrace();
//		    throw ex;	// 2011.10.10 보안점검 후속조치
//		}

		return  tmpString;

	}

    /**
     * <p>날짜 형식의 문자열 내부에 마이너스 character(-)를 추가한다.</p>
     *
     * <pre>
     *   StringUtil.addMinusChar("20100901") = "2010-09-01"
     * </pre>
     *
     * @param date  입력받는 문자열
     * @return " - "가 추가된 입력문자열
     */
	public static String addMinusChar(String date) {
		if(date.length() == 8)
		    return date.substring(0,4).concat("-").concat(date.substring(4,6)).concat("-").concat(date.substring(6,8));
		else return "";
	}
	
	/**
     * <p>Phone Number를 - 를 삽입하여 분리한다.</p>
     *
     * <pre>
     *   StringUtil.splitPhoneNumber(String pno)
     * </pre>
     *
     * @param pno 전화번호
     * @return " - "가 추가된 입력문자열
     */
	public static String[] splitPhoneNumber(String pno) {
    	String[] pnos = {"","",""}; 
    	if (pno != null && !pno.equals("")) {
    		pno = pno.replace("(", "").replace(")", "").replace("-", "").replace(".", "");
    		int len = pno.length();
    		if (len > 8) {
    			// 지역번호 (핸드폰 통신사 식별 번호)
    			if (pno.startsWith("02")) { //공백으로 인한 자리수 디스플레이 오류 및 DB 저장 오류
    				String temppno = pno.substring(0, 2);
    				temppno = temppno.trim();
    				pnos[0] = temppno;
    				//pnos[0] = pno.substring(0, 3);
    				
    				pno = pno.substring(2);
    			}
    			else {
    				pnos[0] = pno.substring(0, 3);
    				pno = pno.substring(3);
    			}
    			
    			// 국번호, 가입자 개별번호
    			if (pno.length() == 7) {
    				pnos[1] = pno.substring(0, 3);
    				pnos[2] = pno.substring(3);
    			}
    			else {
    				pnos[1] = pno.substring(0, 4);
    				pnos[2] = pno.substring(4);
    			}
    		}
    		else if (len >= 5) {
    			pnos[1] = pno.substring(0, 4);
    			pnos[2] = pno.substring(4);
    		}
    		else {
    			pnos[2] = pno;
    		}
    	}
    	return pnos;
    }
	
	/**
	 * 
	 * 숫자인지 체크하기
	 */
	public static boolean NumberChk(String str) {
		char c;
	
		if(str.equals("")) return false;
	
		for(int i = 0 ; i < str.length() ; i++){
			c = str.charAt(i);
			if(c < 48 || c > 59){
				return false;
			}
		}
		
		return true;
	}
	
	/**
     * 랜덤 스트링을 입력받은 수만큼 리턴
     *
     * @param length int
     * @return String
     * @exception Exception
     * @see
     */
	public static synchronized String getRandomString(int length) {
           StringBuilder buffer = new StringBuilder();
           Random random = new Random();

           //String chars[] = "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,0,1,2,3,4,5,6,7,8,9,=,*,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z".split(",");
           String chars[] = "0,1,2,3,4,5,6,7,8,9".split(",");

           for(int i = 0; i < length; i++)
           {
                   buffer.append(chars[random.nextInt(chars.length)]);
           }
           
           return buffer.toString();
    }
	
	/**
	 * 获取UUID
	 * @return String
	 */
	public static String getUUID(){
		String struuid = UUID.randomUUID().toString();
		struuid = struuid.replaceAll("-", "");
		return struuid;
	}
    /** 
    * 汉字转换位汉语拼音，英文字符不变 
    * @param chines 汉字 
    * @return 拼音 
    */  
    public static String converterToSpell(String chines){          
        String pinyinName = "";  
        char[] nameChar = chines.toCharArray();  
        HanyuPinyinOutputFormat defaultFormat = new HanyuPinyinOutputFormat();  
        defaultFormat.setCaseType(HanyuPinyinCaseType.LOWERCASE);  
        defaultFormat.setToneType(HanyuPinyinToneType.WITHOUT_TONE);  
        for (int i = 0; i < nameChar.length; i++) {  
            if (nameChar[i] > 128) {  
                try {  
                    pinyinName += PinyinHelper.toHanyuPinyinStringArray(nameChar[i], defaultFormat)[0];  
                } catch (BadHanyuPinyinOutputFormatCombination e) {  
                    e.printStackTrace();  
                }  
            }else{  
                pinyinName += nameChar[i];  
            }  
        }  
        return pinyinName;  
    }  
    public static String toUtf8String(String s) { 
        StringBuffer sb = new StringBuffer(); 
        for (int i = 0; i < s.length(); i++) { 
            char c = s.charAt(i); 
            if (c >= 0 && c <= 255) { 
                sb.append(c); 
            } else { 
                byte[] b; 
                try { 
                    b = Character.toString(c).getBytes("utf-8"); 
                } catch (Exception ex) { 
                	 	System.out.println("将文件名中的汉字转为UTF8编码的串时错误,输入的字符串为:" + s);
                    b = new byte[0]; 
                } 
                for (int j = 0; j < b.length; j++) { 
                    int k = b[j]; 
                    if (k < 0) 
                        k += 256; 
                    sb.append("%" + Integer.toHexString(k).toUpperCase()); 
                } 
            } 
        } 
        return sb.toString(); 
    } 
 
    /** 
     * 根据不同浏览器将文件名中的汉字转为UTF8编码的串,以便下载时能正确显示另存的文件名. 
     *  
     * @param s 
     *            原文件名 
     * @return 重新编码后的文件名 
     */ 
    public static String toUtf8String(HttpServletRequest request, String s) { 
        String agent = request.getHeader("User-Agent"); 
        try { 
            boolean isFireFox = (agent != null && agent.toLowerCase().indexOf("firefox") != -1); 
            boolean isSafari = (agent != null && agent.toLowerCase().indexOf("safari") != -1); 
            if (isFireFox || isSafari) { 
                s = new String(s.getBytes("UTF-8"), "ISO8859-1"); 
            } else { 
                s = StringUtil.toUtf8String(s); 
                if ((agent != null && agent.indexOf("MSIE") != -1)) { 
                    // see http://support.microsoft.com/default.aspx?kbid=816868 
                    if (s.length() > 150) { 
                        // 根据request的locale 得出可能的编码 
                        s = new String(s.getBytes("UTF-8"), "ISO8859-1"); 
                    } 
                } 
            } 
        } catch (UnsupportedEncodingException e) { 
            e.printStackTrace(); 
        } 
        return s; 
    }
    public static String obj2String(Object obj) {
		if (obj != null) {
			if (obj instanceof String) return (String) obj;
			else if (obj instanceof Date) {
				SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
				return df.format(obj);
			} else {
				try {
					return obj.toString();
				} catch (Exception e) {
					System.out.println(e);
					return "";
				}
			}
		}
		return "";
}


/** 
 * 去除字符串中多余的空格 
 * @param s 
 * @return 去除多余空格后的字符串 
 */ 
public static String removeExtraSpace (String s) {
		return s.replaceAll("[\\s*]+", " ");
}

public static boolean haveChineseChar(String s) {
   String regEx = "[\\u4e00-\\u9fa5]";      
    Pattern p = Pattern.compile(regEx);      
    Matcher m = p.matcher(s);      
    while (m.find()) {      
    		return true;
    }      
   return false;
}

public static boolean haveSpecialChar(String s) {
   if (s == null) return false;
   return !s.matches("[a-zA-Z0-9]*");
}

public static boolean isDigital(String s) {
   if (s == null) return false;
   Pattern pattern = Pattern.compile("[0-9]*"); 
   return pattern.matcher(s).matches();  
}

private final static String[][] FilterChars = { { "<", "&lt;" }, { ">", "&gt;" }, { " ", "&nbsp;" }, { "\"", "&quot;" },
		{ "&", "&amp;" }, { "/", "&#47;" }, { "\\", "&#92;" }, { "\n", "<br>" }, {"'", ""}, {"%'", ""} };
private final static String[][] FilterScriptChars = { { "\n", "\'+\'\\n\'+\'" }, { "\r", " " },
		{ "\\", "\'+\'\\\\\'+\'" }, { "\'", "\'+\'\\\'\'+\'" } };  


/**
 * 用特殊的字符连接字符串
 * 
 * @param strings
 *            要连接的字符串数组
 * @param spilit_sign
 *            连接字符
 * @return 连接字符串
 */
public static String stringConnect(String[] strings, String spilit_sign) {
	String str = "";
	for (int i = 0; i < strings.length; i++) {
		str += strings[i] + spilit_sign;
	}
	return str;
}

/**
 * 过滤字符串里的的特殊字符
 * 
 * @param str
 *            要过滤的字符串
 * @return 过滤后的字符串
 */
public static String stringFilter(String str) {
	String[] str_arr = stringSpilit(str, "");
	for (int i = 0; i < str_arr.length; i++) {
		for (int j = 0; j < FilterChars.length; j++) {
			if (FilterChars[j][0].equals(str_arr[i]))
				str_arr[i] = FilterChars[j][1];
		}
	}
	return (stringConnect(str_arr, "")).trim();
}

/**
 * 过滤脚本中的特殊字符（包括回车符(\n)和换行符(\r)）
 * 
 * @param str
 *            要进行过滤的字符串
 * @return 过滤后的字符串 2004-12-21 闫
 */
public static String stringFilterScriptChar(String str) {
	String[] str_arr = stringSpilit(str, "");
	for (int i = 0; i < str_arr.length; i++) {
		for (int j = 0; j < FilterScriptChars.length; j++) {
			if (FilterScriptChars[j][0].equals(str_arr[i]))
				str_arr[i] = FilterScriptChars[j][1];
		}
	}
	return (stringConnect(str_arr, "")).trim();
}

/**
 * 分割字符串
 * 
 * @param str
 *            要分割的字符串
 * @param spilit_sign
 *            字符串的分割标志
 * @return 分割后得到的字符串数组
 */
public static String[] stringSpilit(String str, String spilit_sign) {
	String[] spilit_string = str.split(spilit_sign);
	if (spilit_string[0].equals("")) {
		String[] new_string = new String[spilit_string.length - 1];
		for (int i = 1; i < spilit_string.length; i++)
			new_string[i - 1] = spilit_string[i];
		return new_string;
	} else
		return spilit_string;
}

/**
 * 字符串字符集转换
 * 
 * @param str
 *            要转换的字符串
 * @return 转换过的字符串
 */
public static String stringTransCharset(String str) {
	String new_str = null;
	try {
		new_str = new String(str.getBytes("iso-8859-1"), "GBK");
	} catch (Exception e) {
		e.printStackTrace();
	}
	return new_str;
}    
/**
 * 正则替换所有特殊字符
 * @param str
 * @return
 */  
public static String replaceSpecStr(String str){
	if (null!=str && !"".equals(str.trim())) {
//		String regEx="[\\s~·`!！@#￥$%^……&*（()）\\-——\\-_=+【\\[\\]】｛{}｝\\|、\\\\；;：:‘'“”\"，,《<。.》>、/？?]";
		String regEx="[\\s~·`!！@#￥$%^……&*（()）\\-——\\-_=+【\\[\\]】｛{}｝\\|、\\\\；;：:‘'“”\"，,《<。》>、/？?]";//不包含.
		Pattern p = Pattern.compile(regEx);
		Matcher m = p.matcher(str);
		return m.replaceAll("");
	}
	return null;
}
public static void main(String[] args) {
   System.out.println(isDigital("0001231是"));
}
}