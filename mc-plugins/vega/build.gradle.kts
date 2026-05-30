plugins {
  java
}

group = "org.liry"
version = "1.0"

// 删掉这里所有 repositories 代码！

dependencies {
  compileOnly("io.papermc.paper:paper-api:1.21.11-R0.1-SNAPSHOT")

  testImplementation(platform("org.junit:junit-bom:6.0.0"))
  testImplementation("org.junit.jupiter:junit-jupiter")
  testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.test {
  useJUnitPlatform()
}

java {
  toolchain.languageVersion.set(JavaLanguageVersion.of(21))
}
