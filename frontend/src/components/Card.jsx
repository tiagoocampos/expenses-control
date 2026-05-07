export function Card({ children }) {
    return (
        <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-800">
            <div className="p-5">{children}</div>
        </div>
    );
}

