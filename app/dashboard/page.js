import Link from 'next/link';

// Mock data for demonstration purposes
const mockForms = [
  { id: 1, name: 'Form 1' },
  { id: 2, name: 'Form 2' },
  { id: 3, name: 'Form 3' },
];

const mockFolders = [
  { id: 1, name: 'Folder 1' },
  { id: 2, name: 'Folder 2' },
  { id: 3, name: 'Folder 3' },
];

export default function Dashboard() {
  return (
    <main className="flex flex-col items-center justify-center w-screen h-screen bg-gray-100 p-6">
      <div className="w-full max-w-7xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Dashboard</h1>
        
        <div className="flex justify-center space-x-4 mb-8">
          <Link href="/dashboard/create-form">
            <span className="py-2 px-4 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Add Form
            </span>
          </Link>
          <Link href="/dashboard/create-folder">
            <span className="py-2 px-4 bg-green-600 text-white rounded cursor-pointer hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
              Add Folder
            </span>
          </Link>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Forms</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {mockForms.map((form) => (
              <div key={form.id} className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-2">{form.name}</h3>
                <p className="text-gray-600">Details about {form.name}...</p>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Folders</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {mockFolders.map((folder) => (
              <div key={folder.id} className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-2">{folder.name}</h3>
                <p className="text-gray-600">Details about {folder.name}...</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
