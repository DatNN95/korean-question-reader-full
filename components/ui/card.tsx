export const Card = ({ children }: any) => <div className="border rounded shadow">{children}</div>;
export const CardContent = ({ children, className = "" }: any) => <div className={className}>{children}</div>;
