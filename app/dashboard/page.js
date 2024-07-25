import Link from 'next/link';

// Mock data for demonstration purposes
const mockForms = [
  { id: 1, name: 'Form 1' },
  { id: 2, name: 'Form 2' },
  { id: 3, name: 'Form 3' },
  { id: 4, name: 'Form 4' },
  { id: 5, name: 'Form 5' },
];

const mockFolders = [
  { id: 1, name: 'Folder 1' },
  { id: 2, name: 'Folder 2' },
  { id: 3, name: 'Folder 3' },
  { id: 4, name: 'Folder 4' },
  { id: 5, name: 'Folder 5' },
];

export default function Dashboard() {
  return (
    <main className="flex flex-col items-center w-screen h-screen bg-gray-100 p-6">
      <div className="w-full max-w-6xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold mb-4 text-gray-900">Dashboard</h1>
          <div className="flex justify-center space-x-4">
            <Link href="/dashboard/create-form">
              <div className="py-3 px-6 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-center">
                <span className="block text-lg font-semibold">Add Form</span>
              </div>
            </Link>
            <Link href="/dashboard/create-folder">
              <div className="py-3 px-6 bg-green-600 text-white rounded cursor-pointer hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-center">
                <span className="block text-lg font-semibold">Add Folder</span>
              </div>
            </Link>
          </div>
        </header>

        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold">Forms</h2>
            {mockForms.length >=4 && (
              <Link href="/dashboard/forms">
                <div className="text-blue-500 hover:underline cursor-pointer text-sm">
                  View More
                </div>
              </Link>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockForms.slice(0, 4).map((form) => (
              <div key={form.id} className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                <h3 className="text-xl font-semibold mb-2">{form.name}</h3>
                <p className="text-gray-600">Details about {form.name}...</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold">Folders</h2>
            {mockFolders.length >= 4 && (
              <Link href="/dashboard/folders">
                <div className="text-green-500 hover:underline cursor-pointer text-sm">
                  View More
                </div>
              </Link>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockFolders.slice(0, 4).map((folder) => (
              <div key={folder.id} className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                <h3 className="text-xl font-semibold mb-2">{folder.name}</h3>
                <p className="text-gray-600">Details about {folder.name}...</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
