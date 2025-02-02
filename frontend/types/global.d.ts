declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    request: (...args: any[]) => Promise<any>;
  };
} 