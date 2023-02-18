package util;

import java.awt.Graphics;
import java.awt.Image;
import java.awt.Toolkit;
import java.awt.image.BufferedImage;
import java.awt.image.CropImageFilter;
import java.awt.image.FilteredImageSource;
import java.awt.image.ImageFilter;
import java.io.File;
import java.io.IOException;

import javax.imageio.ImageIO;

public class ImageCutUtil {

	
	 /**  
     * 图像切割（改）     *  
     * @param path            		源图像地址路径
     * @param name            		源图像文件名
     * @param x                     目标切片起点x坐标 
     * @param y                     目标切片起点y坐标 
     * @param destWidth             目标切片宽度 
     * @param destHeight            目标切片高度 
     */  
    public static void abscut(String path, String name, int x, int y, int destWidth,  
            int destHeight) {  
        try {  
            Image img;  
            ImageFilter cropFilter;  
            // 读取源图像  
            BufferedImage bi = ImageIO.read(new File(path, name));  
            int srcWidth = bi.getWidth(); // 源图宽度  
            int srcHeight = bi.getHeight(); // 源图高度            
            if (srcWidth >= destWidth && srcHeight >= destHeight) {  
                Image image = bi.getScaledInstance(srcWidth, srcHeight,  
                        Image.SCALE_DEFAULT);  
                // 改进的想法:是否可用多线程加快切割速度  
                // 四个参数分别为图像起点坐标和宽高  
                // 即: CropImageFilter(int x,int y,int width,int height)  
                cropFilter = new CropImageFilter(x, y, destWidth, destHeight);  
                img = Toolkit.getDefaultToolkit().createImage(  
                        new FilteredImageSource(image.getSource(), cropFilter));  
                BufferedImage tag = new BufferedImage(destWidth, destHeight,  
                        BufferedImage.TYPE_INT_RGB);  
                Graphics g = tag.getGraphics();  
                g.drawImage(img, 0, 0, null); // 绘制缩小后的图  
                g.dispose();  
                // 输出为文件  
                ImageIO.write(tag, "JPEG", new File(path, name));  
            }  
        } catch (Exception e) {  
            e.printStackTrace();  
        }  
    }
    
    /** 
     * 缩放图像 
     *  
     * @param path            		源图像地址路径
     * @param name            		源图像文件名 
     * @param scale              缩放比例 
     * @param flag               缩放选择:true 放大; false 缩小; 
     */  
    public static void scale(String path, String name, int scale,  
            boolean flag) {  
        try {  
            BufferedImage src = ImageIO.read(new File(path, name)); // 读入文件  
            int width = src.getWidth(); // 得到源图宽  
            int height = src.getHeight(); // 得到源图长  
            if (flag) {  
                // 放大  
                width = width * scale;  
                height = height * scale;  
            } else {  
                // 缩小  
                width = width / scale;  
                height = height / scale;  
            }  
            Image image = src.getScaledInstance(width, height,Image.SCALE_DEFAULT);  
            BufferedImage tag = new BufferedImage(width, height,BufferedImage.TYPE_INT_RGB);  
            Graphics g = tag.getGraphics();  
            g.drawImage(image, 0, 0, null); // 绘制缩小后的图  
            g.dispose();  
            ImageIO.write(tag, "JPEG", new File(path, name));// 输出到文件流  
        } catch (IOException e) {  
            e.printStackTrace();  
        }  
    } 
    
    
    /** 
     * 压缩图像 
     *  
     *  @param path            		源图像地址路径
     *  @param name            		源图像文件名
     */  
    public static void resize(String path, String name) {  
        try {  
            BufferedImage src = ImageIO.read(new File(path, name)); // 读入文件  
            Image image = src.getScaledInstance(200, 200,Image.SCALE_DEFAULT);  
            BufferedImage tag = new BufferedImage(200, 200,BufferedImage.TYPE_INT_RGB);  
            Graphics g = tag.getGraphics();  
            g.drawImage(image, 0, 0, null); // 绘制缩小后的图  
            g.dispose();  
            ImageIO.write(tag, "JPEG", new File(path, name));// 输出到文件流  
        } catch (IOException e) {  
            e.printStackTrace();  
        }  
    }
    
    public static void main(String[] args) {  
////    	abscut("D:/Users/zhangsong/Pictures","11111111.jpg",0,0,230,230);  
//    	try {
////    		File picture = new File("D:/Users/zhangsong/Pictures", "791f3703918fa0ec42df59312_1445850003368.jpg");
////			BufferedImage src = ImageIO.read(picture);
////			System.out.println(picture.length());
////			System.out.println(String.format("%.2f",picture.length()/1024.0)); 
//			
//    	} catch (IOException e) {
//			e.printStackTrace();
//		} // 读入文件  
    	resize("D:/Users/zhangsong/Pictures","cfc8f5fae6cd7b8954fb32a20c2442a7d8330e4f.jpg");
//    	abscut("D:/Users/zhangsong/Pictures","yuantu.jpg",0,0,10,10);
    } 
}
