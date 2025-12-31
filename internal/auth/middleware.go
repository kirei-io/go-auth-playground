package auth

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware(authService *AuthService) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		tokenString, err := authService.ExtractToken(ctx.GetHeader("Authorization"))

		if err != nil || tokenString == "" {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": err.Error(),
			})
			return
		}

		claims := &JWTClaims{}

		token, err := authService.ParseToken(tokenString, claims)

		if err != nil || !token.Valid {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": fmt.Sprintf("%s %s", "Unathorized", err),
			})
			return
		}

		ctx.Set("user", claims)
		ctx.Next()
	}
}

func AuthMiddlewareV2(authService *AuthService) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		tokenString, err := ctx.Cookie("access_token")
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized: Cookie not found"})
			return
		}

		claims := &JWTClaims{}

		token, err := authService.ParseToken(tokenString, claims)

		if err != nil || !token.Valid {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": fmt.Sprintf("%s %s", "Unathorized", err),
			})
			return
		}

		ctx.Set("user", claims)
		ctx.Next()
	}
}
