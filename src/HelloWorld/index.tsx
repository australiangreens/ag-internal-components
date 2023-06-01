export interface HelloWorldProps {
  text: string;
}

export default function HelloWorld({ text }: HelloWorldProps) {
  return <div className="text">This is test text: {text}</div>;
}
