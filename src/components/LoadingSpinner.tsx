export default function LoadingSpinner() {
  return (
    <div className="flex flex-col justify-center items-center py-12 my-12 rounded-lg border border-amber-200 backdrop-blur-sm bg-amber-50/40">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-amber-200 border-opacity-60"></div>
        <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-amber-600 animate-spin border-t-transparent"></div>
      </div>
      <span className="mt-6 text-xl font-medium text-amber-900">Cooking up your recipe...</span>
      <span className="mt-2 text-lg text-amber-700 font-myanmar">သင့်မြန်မာဟင်းလျာကို ပြင်ဆင်နေပါသည်...</span>
    </div>
  );
} 