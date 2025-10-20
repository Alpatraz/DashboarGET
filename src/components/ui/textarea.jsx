export function Textarea({ ...props }) {
    return (
      <textarea
        {...props}
        className="w-full px-3 py-2 border rounded text-sm text-gray-700 focus:outline-none focus:ring focus:border-blue-300"
      />
    );
  }
  