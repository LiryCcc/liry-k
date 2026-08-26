/**
 * Nx 通过 companion 插件读取 Gradle 项目图。
 * 所有子项目共享的配置，单个子项目只写自身特有部分即可。
 */
plugins {
    id("dev.nx.gradle.project-graph") version ("0.1.24")
}

subprojects {
    apply(plugin = "java")

    group = "org.liry"

    dependencies {
        "compileOnly"("io.papermc.paper:paper-api:1.21.11-R0.1-SNAPSHOT")

        "testImplementation"(platform("org.junit:junit-bom:6.0.0"))
        "testImplementation"("org.junit.jupiter:junit-jupiter")
        "testRuntimeOnly"("org.junit.platform:junit-platform-launcher")
    }

    tasks.named<Test>("test") {
        useJUnitPlatform()
    }

    extensions.configure<JavaPluginExtension> {
        toolchain.languageVersion.set(JavaLanguageVersion.of(21))
    }
}

allprojects {
    apply {
        plugin("dev.nx.gradle.project-graph")
    }
}
