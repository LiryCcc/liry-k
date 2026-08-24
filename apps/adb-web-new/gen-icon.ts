import { createCanvas } from '@napi-rs/canvas';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

// 输出目录（项目 public 文件夹）
const OUTPUT_DIR = path.resolve(import.meta.dirname, 'public');

type IconSize = 192 | 512;

/**
 * 生成单张 maskable PWA 图标
 * @param size 尺寸 192 / 512
 */
const generateIcon = async (size: IconSize) => {
  // 创建画布
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // 1. 背景底色（和 manifest theme_color 统一 #2563eb）
  ctx.fillStyle = '#2563eb';
  ctx.fillRect(0, 0, size, size);

  // Maskable 安全内边距 10%（规范要求图标主体在中间80%区域）
  const padding = size * 0.1;
  const innerSize = size - padding * 2;

  // 2. 绘制白色圆形主体
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, innerSize / 2, 0, Math.PI * 2);
  ctx.fill();

  // 3. 绘制简易图标文字 WebADB
  ctx.fillStyle = '#2563eb';
  ctx.font = `bold ${innerSize * 0.3}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ADB', size / 2, size / 2);

  // 导出 PNG Buffer
  const pngBuffer = canvas.toBuffer('image/png');
  const outputPath = path.join(OUTPUT_DIR, `icon-${size}.png`);
  await writeFile(outputPath, pngBuffer);
  console.log(`✅ 已生成: ${outputPath}`);
};

// 批量生成 192 + 512
const main = async () => {
  await generateIcon(192);
  await generateIcon(512);
};

main().catch(console.error);
