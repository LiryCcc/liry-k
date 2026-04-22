import styles from '@/components/demo-mode-panel.module.css';
import { globalAppStore } from '@/store/global-app-store';
import { strings } from '@/strings';
import { Divider, Dropdown, Field, Input, Option, Switch, Text } from '@fluentui/react-components';
import { useStore } from '@tanstack/react-store';
import type { Adb } from '@yume-chan/adb';
import {
  DemoMode,
  DemoModeMobileDataTypes,
  DemoModeSignalStrength,
  DemoModeStatusBarModes,
  type DemoModeMobileDataType,
  type DemoModeStatusBarMode
} from '@yume-chan/android-bin';
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';

const signalStrengthOptions = Object.values(DemoModeSignalStrength).map((key) => ({
  key,
  text: {
    [DemoModeSignalStrength.Hidden]: '隐藏',
    [DemoModeSignalStrength.Level0]: '0 格',
    [DemoModeSignalStrength.Level1]: '1 格',
    [DemoModeSignalStrength.Level2]: '2 格',
    [DemoModeSignalStrength.Level3]: '3 格',
    [DemoModeSignalStrength.Level4]: '4 格'
  }[key]
}));

const mobileDataTypeOptions = DemoModeMobileDataTypes.map((key) => ({
  key,
  text: {
    '1x': '1X',
    '3g': '3G',
    '4g': '4G',
    '4g+': '4G+',
    '5g': '5G',
    '5ge': '5GE',
    '5g+': '5G+',
    e: 'EDGE',
    g: 'GPRS',
    h: 'HSPA',
    'h+': 'HSPA+',
    lte: 'LTE',
    'lte+': 'LTE+',
    dis: '禁用',
    not: '非默认 SIM',
    null: '未知'
  }[key]
}));

const statusBarModeOptions = DemoModeStatusBarModes.map((key) => ({
  key,
  text: {
    opaque: '不透明',
    translucent: '半透明',
    'semi-transparent': '半透',
    transparent: '透明',
    warning: '警告'
  }[key]
}));

type FeatureDefinition = {
  key: string;
  label: string;
  type: 'boolean' | 'number' | 'select';
  min?: number;
  max?: number;
  step?: number;
  options?: { key: string; text: string }[];
  initial: unknown;
  onChange: (demo: DemoMode, value: unknown, features: Map<string, unknown>) => void;
};

const buildFeatureGroups = (): FeatureDefinition[][] => {
  return [
    [
      {
        key: 'batteryLevel',
        label: '电量',
        type: 'number',
        min: 0,
        max: 100,
        step: 1,
        initial: 100,
        onChange: (demo, value) => {
          void demo.setBatteryLevel(value as number);
        }
      },
      {
        key: 'batteryCharging',
        label: '充电中',
        type: 'boolean',
        initial: false,
        onChange: (demo, value) => {
          void demo.setBatteryCharging(value as boolean);
        }
      },
      {
        key: 'powerSaveMode',
        label: '省电模式',
        type: 'boolean',
        initial: false,
        onChange: (demo, value) => {
          void demo.setPowerSaveMode(value as boolean);
        }
      }
    ],
    [
      {
        key: 'wifiSignalStrength',
        label: 'Wi‑Fi 信号',
        type: 'select',
        options: signalStrengthOptions,
        initial: DemoModeSignalStrength.Level4,
        onChange: (demo, value) => {
          void demo.setWifiSignalStrength(value as DemoModeSignalStrength);
        }
      },
      {
        key: 'airplaneMode',
        label: '飞行模式',
        type: 'boolean',
        initial: false,
        onChange: (demo, value) => {
          void demo.setAirplaneMode(value as boolean);
        }
      },
      {
        key: 'mobileDataType',
        label: '移动数据类型',
        type: 'select',
        options: mobileDataTypeOptions,
        initial: 'lte',
        onChange: (demo, value) => {
          void demo.setMobileDataType(value as DemoModeMobileDataType);
        }
      },
      {
        key: 'mobileSignalStrength',
        label: '移动信号',
        type: 'select',
        options: signalStrengthOptions,
        initial: DemoModeSignalStrength.Level4,
        onChange: (demo, value) => {
          void demo.setMobileSignalStrength(value as DemoModeSignalStrength);
        }
      }
    ],
    [
      {
        key: 'statusBarMode',
        label: '状态栏模式',
        type: 'select',
        options: statusBarModeOptions,
        initial: 'transparent',
        onChange: (demo, value) => {
          void demo.setStatusBarMode(value as DemoModeStatusBarMode);
        }
      },
      {
        key: 'vibrateMode',
        label: '振动指示',
        type: 'boolean',
        initial: false,
        onChange: (demo, value) => {
          void demo.setVibrateModeEnabled(value as boolean);
        }
      },
      {
        key: 'bluetoothConnected',
        label: '蓝牙指示',
        type: 'boolean',
        initial: false,
        onChange: (demo, value) => {
          void demo.setBluetoothConnected(value as boolean);
        }
      },
      {
        key: 'locatingIcon',
        label: '定位图标',
        type: 'boolean',
        initial: false,
        onChange: (demo, value) => {
          void demo.setLocatingIcon(value as boolean);
        }
      },
      {
        key: 'alarmIcon',
        label: '闹钟图标',
        type: 'boolean',
        initial: false,
        onChange: (demo, value) => {
          void demo.setAlarmIcon(value as boolean);
        }
      },
      {
        key: 'notificationsVisibility',
        label: '通知可见',
        type: 'boolean',
        initial: true,
        onChange: (demo, value) => {
          void demo.setNotificationsVisibility(value as boolean);
        }
      },
      {
        key: 'hour',
        label: '时钟小时',
        type: 'number',
        min: 0,
        max: 23,
        step: 1,
        initial: 12,
        onChange: (demo, value, feat) => {
          const minute = (feat.get('minute') as number | undefined) ?? 34;
          void demo.setTime(value as number, minute);
        }
      },
      {
        key: 'minute',
        label: '时钟分钟',
        type: 'number',
        min: 0,
        max: 59,
        step: 1,
        initial: 34,
        onChange: (demo, value, feat) => {
          const hour = (feat.get('hour') as number | undefined) ?? 12;
          void demo.setTime(hour, value as number);
        }
      }
    ]
  ];
};

const FeatureControl = (props: {
  feature: FeatureDefinition;
  features: Map<string, unknown>;
  allowed: boolean;
  demo: DemoMode | undefined;
  onChange: (key: string, value: unknown) => void;
}) => {
  const { feature, features, allowed, demo, onChange } = props;
  const value = features.get(feature.key) ?? feature.initial;

  if (!demo) {
    return null;
  }

  if (feature.type === 'boolean') {
    return (
      <Field label={feature.label}>
        <Switch
          disabled={!allowed}
          checked={value as boolean}
          onChange={(_, data) => {
            onChange(feature.key, data.checked);
          }}
        />
      </Field>
    );
  }

  if (feature.type === 'number') {
    return (
      <Field label={feature.label}>
        <Input
          type='number'
          disabled={!allowed}
          min={feature.min}
          max={feature.max}
          step={feature.step}
          value={String(value)}
          onChange={(_, data) => {
            const n = Number.parseFloat(data.value);
            if (!Number.isNaN(n)) {
              onChange(feature.key, n);
            }
          }}
        />
      </Field>
    );
  }

  if (feature.type === 'select' && feature.options) {
    return (
      <Field label={feature.label}>
        <Dropdown
          disabled={!allowed}
          value={String(value)}
          onOptionSelect={(_, data) => {
            if (data.optionValue) {
              onChange(feature.key, data.optionValue);
            }
          }}
        >
          {feature.options.map((o) => (
            <Option key={o.key} value={o.key} text={o.text}>
              {o.text}
            </Option>
          ))}
        </Dropdown>
      </Field>
    );
  }

  return null;
};

export type DemoModePanelProps = {
  style?: CSSProperties;
};

const DemoModePanelInner = ({ adb, style }: { adb: Adb; style?: CSSProperties }) => {
  const demoMode = useMemo(() => new DemoMode(adb), [adb]);
  const [allowed, setAllowed] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [features, setFeatures] = useState(() => new Map<string, unknown>());
  const featuresRef = useRef(features);
  useEffect(() => {
    featuresRef.current = features;
  }, [features]);

  useEffect(() => {
    const ac = new AbortController();
    void (async () => {
      const ok = await demoMode.getAllowed();
      if (ac.signal.aborted) {
        return;
      }
      setAllowed(ok);
      if (ok) {
        const on = await demoMode.getEnabled();
        if (!ac.signal.aborted) {
          setEnabled(on);
        }
      } else {
        setEnabled(false);
      }
    })();
    return () => {
      ac.abort();
    };
  }, [demoMode]);

  useEffect(() => {
    if (!enabled || !demoMode) {
      return;
    }
    const groups = buildFeatureGroups();
    for (const group of groups) {
      for (const f of group) {
        f.onChange(demoMode, featuresRef.current.get(f.key) ?? f.initial, featuresRef.current);
      }
    }
  }, [enabled, demoMode]);

  const handleFeatureChange = useCallback(
    (key: string, value: unknown) => {
      if (!demoMode) {
        return;
      }
      setFeatures((prev) => {
        const next = new Map(prev);
        next.set(key, value);
        const groups = buildFeatureGroups();
        for (const group of groups) {
          for (const f of group) {
            if (f.key === key) {
              f.onChange(demoMode, value, next);
            }
          }
        }
        return next;
      });
      setEnabled(true);
    },
    [demoMode]
  );

  const handleAllowed = useCallback(
    async (_: unknown, data: { checked: boolean }) => {
      if (!demoMode) {
        return;
      }
      await demoMode.setAllowed(data.checked);
      setAllowed(data.checked);
      setEnabled(false);
    },
    [demoMode]
  );

  const handleEnabled = useCallback(
    async (_: unknown, data: { checked: boolean }) => {
      if (!demoMode) {
        return;
      }
      await demoMode.setEnabled(data.checked);
      setEnabled(data.checked);
    },
    [demoMode]
  );

  const groups = demoMode ? buildFeatureGroups() : [];

  return (
    <div className={styles.panel} style={style}>
      <Field label={strings.demoMode.allowed}>
        <Switch checked={allowed} onChange={handleAllowed} />
      </Field>

      <Field label={strings.demoMode.enabled}>
        <Switch disabled={!allowed} checked={enabled} onChange={handleEnabled} />
      </Field>

      <Text weight='semibold'>{strings.demoMode.noteTitle}</Text>
      <Text>{strings.demoMode.noteBody}</Text>

      {groups.map((group, gi) => (
        <div key={gi}>
          <Divider />
          {group.map((f) => (
            <div key={f.key} className={styles.field}>
              <FeatureControl
                feature={f}
                features={features}
                allowed={allowed}
                demo={demoMode}
                onChange={handleFeatureChange}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export const DemoModePanel = ({ style }: DemoModePanelProps) => {
  const adb = useStore(globalAppStore, (s) => s.adb);
  const serial = useStore(globalAppStore, (s) => s.device?.serial ?? '');

  if (!adb) {
    return <div className={styles.panel} style={style} />;
  }

  return <DemoModePanelInner key={serial} adb={adb} style={style} />;
};
