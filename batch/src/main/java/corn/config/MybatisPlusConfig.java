package corn.config;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;


@Configuration
@MapperScan(value={"corn.mapper"})
public class MybatisPlusConfig {

}
