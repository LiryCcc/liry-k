import { PageShell } from '@/components/page-shell';
import { globalAppStore } from '@/store/global-app-store';
import { strings } from '@/strings';
import { Divider, MessageBar, MessageBarBody, Text, Tooltip } from '@fluentui/react-components';
import { InfoRegular } from '@fluentui/react-icons';
import { useStore } from '@tanstack/react-store';
import { AdbFeature } from '@yume-chan/adb';
import { useEffect } from 'react';

const knownFeatures: Record<string, string> = {
  [AdbFeature.ShellV2]: 'shell 命令可分离子进程 stdout/stderr 并返回退出码',
  [AdbFeature.StatV2]: 'sync 命令支持 STA2（较 STAT 返回更多文件信息）与 LST2（目录列表信息）子命令',
  [AdbFeature.ListV2]: 'sync 命令支持 LST2 子命令，列目录时信息更完整',
  [AdbFeature.FixedPushMkdir]: 'Android 9 曾存在推送至不存在目录会失败的缺陷；此特性表示已修复（Android 10）',
  [AdbFeature.AbbExec]: '支持 abb_exec 变体，可更快安装应用',
  sendrecv_v2_brotli: '推送/拉取文件支持 brotli 压缩',
  sendrecv_v2_lz4: '推送/拉取文件支持 lz4 压缩',
  sendrecv_v2_zstd: '推送/拉取文件支持 zstd 压缩'
};

export const DeviceInfoPage = () => {
  const adb = useStore(globalAppStore, (s) => s.adb);

  useEffect(() => {
    document.title = strings.deviceInfo.documentTitle;
  }, []);

  return (
    <PageShell>
      {!adb ? (
        <MessageBar intent='warning'>
          <MessageBarBody>{strings.deviceInfo.noDevice}</MessageBarBody>
        </MessageBar>
      ) : null}

      <MessageBar>
        <MessageBarBody>{strings.deviceInfo.productProp}</MessageBarBody>
      </MessageBar>
      <Text>
        {strings.deviceInfo.productName} {adb?.banner.product ?? '—'}
      </Text>
      <Divider />

      <MessageBar>
        <MessageBarBody>{strings.deviceInfo.modelProp}</MessageBarBody>
      </MessageBar>
      <Text>
        {strings.deviceInfo.modelName} {adb?.banner.model ?? '—'}
      </Text>
      <Divider />

      <MessageBar>
        <MessageBarBody>{strings.deviceInfo.deviceProp}</MessageBarBody>
      </MessageBar>
      <Text>
        {strings.deviceInfo.deviceName} {adb?.banner.device ?? '—'}
      </Text>
      <Divider />

      <MessageBar>
        <MessageBarBody>{strings.deviceInfo.featuresIntro}</MessageBarBody>
      </MessageBar>
      <Text>
        {strings.deviceInfo.featuresLabel}{' '}
        {adb?.banner.features.map((feature, index) => (
          <span key={feature}>
            {index !== 0 ? ', ' : null}
            <span>{feature}</span>
            {knownFeatures[feature] ? (
              <Tooltip content={knownFeatures[feature]} relationship='label'>
                <InfoRegular style={{ marginLeft: 4, verticalAlign: 'middle' }} />
              </Tooltip>
            ) : null}
          </span>
        )) ?? '—'}
      </Text>
    </PageShell>
  );
};
