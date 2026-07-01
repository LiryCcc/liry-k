rootProject.name = "mc-plugins"

pluginManagement {
    repositories {
        // 腾讯镜像
        maven("https://mirrors.cloud.tencent.com/nexus/repository/maven-public/")
        maven("https://mirrors.cloud.tencent.com/nexus/repository/google/")
        maven("https://mirrors.cloud.tencent.com/nexus/repository/gradle-plugin/")
        // 官方兜底
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version "1.0.0"
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        maven("https://repo.papermc.io/repository/maven-public/") {
            name = "papermc"
        }
        mavenCentral()
    }
}

// 新增子项目时在此 include，并用 project(...).projectDir 指向实际目录
include("vega")
project(":vega").projectDir = file("mc-plugins/vega")
