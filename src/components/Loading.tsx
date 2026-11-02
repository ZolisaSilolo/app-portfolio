const Loading = () => {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="relative w-8 h-8">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 animate-spin" />
      </div>
    </div>
  );
};

export default Loading;
