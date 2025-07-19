interface ErrorProps {
  message: string;
}

export function Error({ message }: ErrorProps) {
  return (
    <div className="bg-red-500/30 border border-red-500 text-red-500 h-7 pl-2 text-sm rounded-full flex items-center gap-x-1 mt-2">
      <div className="w-1 bg-red-500 h-4 rounded-full"></div>
      <p>{message}</p>
    </div>
  );
}
