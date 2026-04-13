import dayjs from 'dayjs';
import { PREFIX } from './name.js';

export const snowflakeId = () => `${PREFIX}-${dayjs().valueOf()}-${crypto.randomUUID()}`;
