rootProject.name = "vega"

pluginManagement {
  repositories {
    // 腾讯云镜像（优先）
    maven { url = uri("https://mirrors.cloud.tencent.com/nexus/repository/maven-public/") }
    maven { url = uri("https://mirrors.cloud.tencent.com/nexus/repository/google/") }
    maven { url = uri("https://mirrors.cloud.tencent.com/nexus/repository/gradle-plugin/") }
    // 官方备用
    google()
    mavenCentral()
    gradlePluginPortal()
  }
}

dependencyResolutionManagement {

}
