package com.intern.hrms.utility;

import java.security.SecureRandom;
import java.util.Random;

public class RandomStringGenerator {
    private static final String ALL_CHAR = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+";
    private static final Random random = new SecureRandom();
    public static String generateString(int length){
        StringBuilder randomString = new StringBuilder(length);
        for(int i = 0; i<length; i++){
            randomString.append(ALL_CHAR.charAt(random.nextInt(ALL_CHAR.length())));
        }
        return randomString.toString();
    }
}