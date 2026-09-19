import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { RoomTypeModal } from './RoomTypeModal';
import { Plus, Edit, Power, DoorOpen } from 'lucide-react';

export const RoomTypesSection = ({
  roomTypes = [],
  rooms = [],
  onAddRoomType,
  onUpdateRoomType,
  onToggleStatus
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);

  const handleCreateSubmit = (data) => {
    onAddRoomType(data);
    setIsModalOpen(false);
  };

  const handleEditSubmit = (data) => {
    if (editingType) {
      onUpdateRoomType(editingType.id, data);
      setEditingType(null);
    }
  };

  const handleToggleConfirm = (typeObj) => {
    const isUsed = rooms.some((r) => r.type === typeObj.name);
    if (typeObj.status === 'Active' && isUsed) {
      const confirmDeactivate = window.confirm(
        `Room type '${typeObj.name}' is currently used by rooms in your inventory. Deactivate this room type?`
      );
      if (!confirmDeactivate) return;
    }
    onToggleStatus(typeObj.id);
  };

  return (
    <Card
      title="Room Categories & Inventory Configuration"
      subtitle="Manage property room types, default pricing per night, guest capacity, and amenities"
      headerAction={
        <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsModalOpen(true)}>
          Add Room Type
        </Button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
        {roomTypes.map((rt) => {
          const roomCount = rooms.filter((r) => r.type === rt.name).length;

          return (
            <div
              key={rt.id}
              style={{
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: '8px',
                  backgroundColor: 'var(--accent-gold-bg)',
                  border: '1px solid var(--accent-gold-border)',
                  color: 'var(--accent-gold-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <DoorOpen size={22} />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{rt.name}</strong>
                    <Badge status={rt.status}>{rt.status}</Badge>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({roomCount} inventory rooms)</span>
                  </div>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: '0.2rem 0' }}>
                    {rt.description}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Amenities: {rt.amenities || 'Standard hotel amenities'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    ₹{(rt.defaultPrice || 0).toLocaleString('en-IN')}
                    <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>/night</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Max {rt.maxGuests} Guests
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Edit}
                    onClick={() => setEditingType(rt)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Power}
                    title={rt.status === 'Active' ? 'Deactivate Room Type' : 'Activate Room Type'}
                    onClick={() => handleToggleConfirm(rt)}
                    style={{ color: rt.status === 'Active' ? 'var(--status-danger-text)' : 'var(--status-success-text)' }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      <RoomTypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateSubmit}
      />

      {/* Edit Modal */}
      {editingType && (
        <RoomTypeModal
          isOpen={Boolean(editingType)}
          onClose={() => setEditingType(null)}
          onSubmit={handleEditSubmit}
          initialData={editingType}
        />
      )}
    </Card>
  );
};
