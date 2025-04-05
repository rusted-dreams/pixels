const Sidebar = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Operations</h2>
      <ul className="space-y-2">
        <li className="cursor-pointer hover:text-blue-500">Gaussian Blur</li>
        <li className="cursor-pointer hover:text-blue-500">Grayscale</li>
        <li className="cursor-pointer hover:text-blue-500">Sharpen</li>
        {/* Add more operations later */}
      </ul>
    </div>
  );
};

export default Sidebar;
