type FetchStatusProps = {
  message: string;
};

export function FetchStatus({ message }: FetchStatusProps) {
  return <p className="mt-3 min-h-5 text-sm text-slate-400">{message}</p>;
}
