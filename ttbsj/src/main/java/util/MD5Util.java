package util;

import java.math.BigInteger;
import java.security.InvalidKeyException;
import java.security.Key;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.DESKeySpec;
import javax.crypto.spec.DESedeKeySpec;
import javax.crypto.spec.SecretKeySpec;

/**   
 *
 * @ClassName MD5Util
 * @Description
 * Copyright (c) 2014 by NS Soft. 
 * @author xuliguo   
 * @date 2015年7月20日 下午3:36:04    
 * @version V1.0      
 *    
 */
public class MD5Util {
	public static Key generateKey(String algorithm, byte keyData[])
			throws NoSuchAlgorithmException, InvalidKeyException,
			InvalidKeySpecException {
		String upper = algorithm.toUpperCase();
		if ("DES".equals(upper)) {
			java.security.spec.KeySpec keySpec = new DESKeySpec(keyData);
			SecretKeyFactory secretKeyFactory = SecretKeyFactory
					.getInstance(algorithm);
			javax.crypto.SecretKey secretKey = secretKeyFactory
					.generateSecret(keySpec);
			return secretKey;
		}
		if ("DESede".equals(upper) || "TripleDES".equals(upper)) {
			java.security.spec.KeySpec keySpec = new DESedeKeySpec(keyData);
			SecretKeyFactory secretKeyFactory = SecretKeyFactory
					.getInstance(algorithm);
			javax.crypto.SecretKey secretKey = secretKeyFactory
					.generateSecret(keySpec);
			return secretKey;
		} else {
			SecretKeySpec keySpec = new SecretKeySpec(keyData, algorithm);
			return keySpec;
		}
	}

	public static String getMD5(String input) {
		input = (new StringBuilder(String.valueOf(input))).append("ellay")
				.toString();
		try {
			MessageDigest md = MessageDigest.getInstance("MD5");
			byte messageDigest[] = md.digest(input.getBytes());
			BigInteger number = new BigInteger(1, messageDigest);
			String hashtext;
			for (hashtext = number.toString(16); hashtext.length() < 32; hashtext = (new StringBuilder(
					"0")).append(hashtext).toString())
				;
			return hashtext;
		} catch (NoSuchAlgorithmException e) {
			throw new RuntimeException(e);
		}
	}
	
	

	public static String toSHA256(String str) {
		String SHA = "";
		try {
			MessageDigest sh = MessageDigest.getInstance("SHA-256");
			sh.update(str.getBytes());
			byte byteData[] = sh.digest();
			StringBuffer sb = new StringBuffer();
			for (int i = 0; i < byteData.length; i++) {
				sb.append(Integer.toString((byteData[i] & 0xff) + 0x100, 16)
						.substring(1));
			}
			SHA = sb.toString();
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
			SHA = null;
		}
		return SHA;
	}
}
