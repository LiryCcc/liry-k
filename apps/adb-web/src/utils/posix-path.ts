export const posixResolve = (dir: string, name: string): string => {
  if (name.startsWith('/')) {
    return name.replaceAll(/\/+/g, '/');
  }
  const base = dir.endsWith('/') ? dir : `${dir}/`;
  return (base + name).replaceAll(/\/+/g, '/');
};

export const posixBasename = (p: string): string => {
  const segments = p.split('/').filter(Boolean);
  const last = segments.at(-1);
  return last ?? p;
};

export const posixExtname = (name: string): string => {
  const i = name.lastIndexOf('.');
  return i === -1 ? '' : name.slice(i);
};
