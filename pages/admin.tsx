import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { firestore } from "../firebase/config";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

interface UserRow {
  uid: string;
  email: string;
  displayName?: string;
  role: "admin" | "user";
}

const AdminDashboard: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);

  useEffect(() => {
    if (!isAdmin) return;
    setFetching(true);
    getDocs(collection(firestore, "users")).then((snap) => {
      const users: UserRow[] = [];
      snap.forEach((doc) => {
        const d = doc.data();
        users.push({
          uid: d.uid,
          email: d.email,
          displayName: d.displayName,
          role: d.role,
        });
      });
      setUsers(users);
      setFetching(false);
    });
  }, [isAdmin]);

  const setUserRole = async (uid: string, role: "admin" | "user") => {
    await updateDoc(doc(firestore, "users", uid), { role });
    setUsers((prev) =>
      prev.map((u) => (u.uid === uid ? { ...u, role } : u))
    );
  };

  if (loading || fetching) return <div>Loading...</div>;
  if (!isAdmin) return <div>Access denied. Admins only.</div>;

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto", padding: "2rem", background: "#fff", borderRadius: 8 }}>
      <h1>Admin Dashboard</h1>
      <h3>User Management</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: 8 }}>Email</th>
            <th style={{ textAlign: "left", padding: 8 }}>Display Name</th>
            <th style={{ textAlign: "left", padding: 8 }}>Role</th>
            <th style={{ textAlign: "left", padding: 8 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.uid}>
              <td style={{ padding: 8 }}>{u.email}</td>
              <td style={{ padding: 8 }}>{u.displayName}</td>
              <td style={{ padding: 8 }}>{u.role}</td>
              <td style={{ padding: 8 }}>
                {u.role !== "admin" && (
                  <button onClick={() => setUserRole(u.uid, "admin")}>Make Admin</button>
                )}
                {u.role !== "user" && (
                  <button onClick={() => setUserRole(u.uid, "user")}>Remove Admin</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;