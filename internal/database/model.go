package database

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Role struct {
	ID   uuid.UUID `gorm:"primaryKey"`
	Name string    `gorm:"unique;not null"`
}

type User struct {
	ID       uuid.UUID `gorm:"type:uuid;primaryKey"`
	Name     string    `gorm:"type:varchar(100)"`
	Email    string    `gorm:"uniqueIndex;not null"`
	Login    string    `gorm:"uniqueIndex;not null"`
	Password string    `gorm:"not null"`

	RoleID uuid.UUID
	Role   Role `gorm:"foreignKey:RoleID" json:"role"`
}

func (u *Role) BeforeCreate(tx *gorm.DB) (err error) {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return
}

func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return
}
