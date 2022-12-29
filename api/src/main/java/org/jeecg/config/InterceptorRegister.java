package org.jeecg.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
public class InterceptorRegister extends WebMvcConfigurerAdapter {

    private static final Logger logger = LoggerFactory.getLogger(InterceptorRegister.class);

    @Value("${jeecg.path.upload}")
    private String upLoadPath;

    @Value("${jeecg.path.public}")
    private String publicPath;

    /*
     * 注册静态文件的自定义映射路径
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        //定义到硬盘
        registry.addResourceHandler("/resource/**")
                .addResourceLocations("file:" + upLoadPath + "/")
                .addResourceLocations("file:" + publicPath + "/");
        super.addResourceHandlers(registry);
    }
}