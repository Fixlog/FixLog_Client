import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Folder {
  folder_id: number;
  name: string;
}

const BookmarkFolderList = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchFolders = async () => {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/login");
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: 0, size: 20 } // 일단 20개까지 가져오도록 설정
      };

      try {
        const res = await axios.get(`${apiUrl}/bookmark-folders`, config);
        setFolders(res.data.data.content);
      } catch (err) {
        console.error("북마크 폴더 로딩 실패:", err);
        setFolders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFolders();
  }, [apiUrl, navigate]);

  const handleFolderClick = (folderId: number) => {
    // 북마크 폴더를 클릭하면 바로 해당 폴더의 전체보기 페이지로 이동
    navigate(`/my-all-posts/bookmarks/${folderId}`);
  };

  if (loading) {
    return <p className="mt-4">북마크 폴더를 불러오는 중...</p>;
  }

  if (folders.length === 0) {
    return <p className="mt-4 text-gray-500">생성된 북마크 폴더가 없습니다.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
      {folders.map((folder) => (
        <button
          key={folder.folder_id}
          onClick={() => handleFolderClick(folder.folder_id)}
          className="p-6 bg-white border rounded-lg shadow hover:shadow-md transition-shadow text-left"
        >
          <h3 className="font-normal text-lg">{folder.name}</h3>
          {/* Todo: 폴더 아이콘 등 부가적인 요소들 추가 */}
        </button>
      ))}
    </div>
  );
};

export default BookmarkFolderList;
