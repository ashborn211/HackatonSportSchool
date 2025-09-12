import { useEffect, useState } from "react";
import axios from "axios";
import { Member } from "./types";

export default function MembersList() {
  const [members, setMembers] = useState<Member[]>([]);
  const [name, setName] = useState("");
  const [subscriptionType, setSubscriptionType] = useState("");
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    axios.get<Member[]>("http://localhost:5000/api/members", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setMembers(res.data));
  }, [token]);

  const addMember = async () => {
    const res = await axios.post<Member>("http://localhost:5000/api/members",
      { name, subscriptionType },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setMembers([...members, res.data]);
    setName("");
    setSubscriptionType("");
  };

  return (
    <div>
      <h2>Members</h2>
      <ul>
        {members.map(m => <li key={m.id}>{m.name} ({m.subscriptionType})</li>)}
      </ul>
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Subscription" value={subscriptionType} onChange={e => setSubscriptionType(e.target.value)} />
      <button onClick={addMember}>Add Member</button>
    </div>
  );
}
