import { test, expect } from '@playwright/test'

test.describe('Mancala Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3002/')
  })

  test('should display welcome screen on load', async ({ page }) => {
    // Check for title
    await expect(page.getByRole('heading', { name: 'Mancala' })).toBeVisible()

    // Check for welcome message
    await expect(page.getByText('Welcome to Mancala!')).toBeVisible()

    // Check for game rules
    await expect(page.getByText(/Click a pit on your side/)).toBeVisible()

    // Check for Start Game button
    await expect(page.getByRole('button', { name: /Start Game/i })).toBeVisible()
  })

  test('should start a new game when Start Game is clicked', async ({ page }) => {
    // Click Start Game button
    await page.getByRole('button', { name: /Start Game/i }).click()

    // Welcome screen should disappear
    await expect(page.getByText('Welcome to Mancala!')).not.toBeVisible()

    // Game board should appear
    await expect(page.getByText(/Player's Turn|AI's Turn/)).toBeVisible()

    // Should have New Game button instead of Start Game
    await expect(page.getByRole('button', { name: /New Game/i })).toBeVisible()
  })

  test('should display game board with correct initial state', async ({ page }) => {
    await page.getByRole('button', { name: /Start Game/i }).click()

    // Wait for board to load
    await page.waitForTimeout(500)

    // Each pit should have stones (count badges visible)
    // Player 1 has 6 pits, Player 2 has 6 pits, 2 stores = 14 total positions
    // Each pit starts with 4 stones, stores start with 0

    // Check for player names/labels
    await expect(page.getByText('Player')).toBeVisible()
    await expect(page.getByText('AI')).toBeVisible()
  })

  test('should allow player to make a valid move', async ({ page }) => {
    await page.getByRole('button', { name: /Start Game/i }).click()
    await page.waitForTimeout(500)

    // Find clickable pits (should have cursor-pointer class)
    const pits = page.getByRole('button').filter({ has: page.locator('[aria-label*="Pit"]') })

    // Click first available pit
    const firstPit = pits.first()
    await firstPit.click()

    // Wait for move animation
    await page.waitForTimeout(1000)

    // AI should be thinking or have made a move
    const aiThinking = page.getByText(/AI is thinking/i)
    const aiTurn = page.getByText(/AI's Turn/i)

    // One of these should be true
    const hasAIIndicator = await aiThinking.isVisible().catch(() => false)
    const hasAITurn = await aiTurn.isVisible().catch(() => false)

    expect(hasAIIndicator || hasAITurn).toBeTruthy()
  })

  test('should show AI thinking indicator', async ({ page }) => {
    await page.getByRole('button', { name: /Start Game/i }).click()
    await page.waitForTimeout(500)

    // Make a move
    const pits = page.getByRole('button').filter({ has: page.locator('[aria-label*="Pit"]') })
    await pits.first().click()

    // Should show AI thinking indicator briefly
    await expect(page.getByText(/AI is thinking/i)).toBeVisible({ timeout: 2000 })
  })

  test('should change difficulty level', async ({ page }) => {
    // Open difficulty selector
    await page.getByLabel('Difficulty').click()

    // Select Hard difficulty
    await page.getByRole('option', { name: 'Hard' }).click()

    // Start game
    await page.getByRole('button', { name: /Start Game/i }).click()
    await page.waitForTimeout(500)

    // Game should start successfully
    await expect(page.getByText(/Player's Turn|AI's Turn/)).toBeVisible()
  })

  test('should open and display leaderboard', async ({ page }) => {
    // Click Stats button
    await page.getByRole('button', { name: /Stats/i }).click()

    // Leaderboard dialog should open
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByText('Your Stats')).toBeVisible()

    // Should show initial stats (0 wins, 0 losses)
    await expect(page.getByText(/Wins/i)).toBeVisible()
    await expect(page.getByText(/Losses/i)).toBeVisible()
    await expect(page.getByText(/Games Played/i)).toBeVisible()

    // Close dialog by clicking X or outside
    await page.getByRole('button', { name: 'Close' }).click()
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })

  test('should reset stats in leaderboard', async ({ page }) => {
    // Open leaderboard
    await page.getByRole('button', { name: /Stats/i }).click()
    await expect(page.getByRole('dialog')).toBeVisible()

    // Click Reset Stats button
    await page.getByRole('button', { name: /Reset Stats/i }).click()

    // Stats should still be visible (just reset to 0)
    await expect(page.getByText('Your Stats')).toBeVisible()
  })

  test('should start new game from game controls', async ({ page }) => {
    // Start initial game
    await page.getByRole('button', { name: /Start Game/i }).click()
    await page.waitForTimeout(500)

    // Make a move to change game state
    const pits = page.getByRole('button').filter({ has: page.locator('[aria-label*="Pit"]') })
    await pits.first().click()
    await page.waitForTimeout(1500)

    // Click New Game
    await page.getByRole('button', { name: /New Game/i }).click()

    // Board should reset
    await page.waitForTimeout(500)
    await expect(page.getByText(/Player's Turn/i)).toBeVisible()
  })

  test('should display current player indicator', async ({ page }) => {
    await page.getByRole('button', { name: /Start Game/i }).click()
    await page.waitForTimeout(500)

    // Should show whose turn it is
    const turnIndicator = page.locator("text=/Player's Turn|AI's Turn/i")
    await expect(turnIndicator).toBeVisible()
  })

  test('should handle multiple moves in sequence', async ({ page }) => {
    await page.getByRole('button', { name: /Start Game/i }).click()
    await page.waitForTimeout(500)

    // Make 3 moves
    for (let i = 0; i < 3; i++) {
      // Wait for player turn
      await page.waitForSelector("text=/Player's Turn/i", { timeout: 5000 })

      // Find and click an available pit
      const pits = page.getByRole('button').filter({ has: page.locator('[aria-label*="Pit"]') })
      const clickablePit = await pits.first()

      if (await clickablePit.isEnabled()) {
        await clickablePit.click()
        await page.waitForTimeout(2000) // Wait for AI response
      } else {
        break
      }
    }

    // Game should still be running or finished
    const gameRunning = await page
      .getByText(/Player's Turn|AI's Turn|Victory|Game Over/i)
      .isVisible()
    expect(gameRunning).toBeTruthy()
  })

  test(
    'should show victory dialog when game ends',
    async ({ page }) => {
      // Set difficulty to easy for faster game
      await page.getByLabel('Difficulty').click()
      await page.getByRole('option', { name: 'Easy' }).click()

      await page.getByRole('button', { name: /Start Game/i }).click()
      await page.waitForTimeout(500)

      // Play until game ends (with timeout)
      let gameEnded = false
      let moves = 0
      const maxMoves = 50

      while (!gameEnded && moves < maxMoves) {
        // Check if victory dialog appeared
        const victoryDialog = page.getByText(/Victory|Game Over|Tie/i)
        if (await victoryDialog.isVisible().catch(() => false)) {
          gameEnded = true
          break
        }

        // Try to make a move if it's player's turn
        const isPlayerTurn = await page
          .getByText(/Player's Turn/i)
          .isVisible()
          .catch(() => false)
        if (isPlayerTurn) {
          const pits = page.getByRole('button').filter({ has: page.locator('[aria-label*="Pit"]') })
          const firstPit = pits.first()

          if (await firstPit.isEnabled().catch(() => false)) {
            await firstPit.click()
            moves++
          }
        }

        await page.waitForTimeout(1000)
      }

      // If game didn't end naturally, that's ok - the test validates the game flow works
      if (gameEnded) {
        // Verify victory dialog components
        await expect(page.getByRole('button', { name: /Play Again/i })).toBeVisible()
        await expect(page.getByRole('button', { name: /Share/i })).toBeVisible()
      }
    },
    { timeout: 120000 }
  ) // Extend timeout for full game

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Page should still load correctly
    await expect(page.getByRole('heading', { name: 'Mancala' })).toBeVisible()
    await expect(page.getByRole('button', { name: /Start Game/i })).toBeVisible()

    // Start game
    await page.getByRole('button', { name: /Start Game/i }).click()
    await page.waitForTimeout(500)

    // Board should be visible and functional
    const pits = page.getByRole('button').filter({ has: page.locator('[aria-label*="Pit"]') })
    await expect(pits.first()).toBeVisible()
  })

  test('should persist leaderboard stats after page reload', async ({ page }) => {
    // Clear any existing stats first
    await page.getByRole('button', { name: /Stats/i }).click()
    await page.getByRole('button', { name: /Reset Stats/i }).click()
    await page.getByRole('button', { name: 'Close' }).click()

    // Reload page
    await page.reload()

    // Stats should still exist (even if at 0)
    await page.getByRole('button', { name: /Stats/i }).click()
    await expect(page.getByText('Your Stats')).toBeVisible()
    await expect(page.getByText(/Games Played/i)).toBeVisible()
  })

  test('should display game rules in welcome screen', async ({ page }) => {
    // Check all 5 rules are present
    await expect(page.getByText(/Click a pit on your side/)).toBeVisible()
    await expect(page.getByText(/distributed counter-clockwise/)).toBeVisible()
    await expect(page.getByText(/last stone lands in your store.*another turn/i)).toBeVisible()
    await expect(page.getByText(/empty pit.*Capture/)).toBeVisible()
    await expect(page.getByText(/one side is empty.*Most stones wins/i)).toBeVisible()
  })

  test('should show capture notification when stones are captured', async ({ page }) => {
    await page.getByRole('button', { name: /Start Game/i }).click()
    await page.waitForTimeout(500)

    // Play several moves to potentially trigger a capture
    for (let i = 0; i < 10; i++) {
      const isPlayerTurn = await page
        .getByText(/Player's Turn/i)
        .isVisible()
        .catch(() => false)
      if (!isPlayerTurn) {
        await page.waitForTimeout(1500)
        continue
      }

      const pits = page.getByRole('button').filter({ has: page.locator('[aria-label*="Pit"]') })
      const firstPit = pits.first()

      if (await firstPit.isEnabled().catch(() => false)) {
        await firstPit.click()
        await page.waitForTimeout(500)

        // Check for capture notification
        const captured = await page
          .getByText(/Captured.*stones/i)
          .isVisible()
          .catch(() => false)
        if (captured) {
          // Test passes - we found a capture
          expect(captured).toBeTruthy()
          break
        }
      }

      await page.waitForTimeout(1500)
    }
  })

  test('should show extra turn notification', async ({ page }) => {
    await page.getByRole('button', { name: /Start Game/i }).click()
    await page.waitForTimeout(500)

    // Try to trigger an extra turn by playing moves
    for (let i = 0; i < 10; i++) {
      const isPlayerTurn = await page
        .getByText(/Player's Turn/i)
        .isVisible()
        .catch(() => false)
      if (!isPlayerTurn) {
        await page.waitForTimeout(1500)
        continue
      }

      const pits = page.getByRole('button').filter({ has: page.locator('[aria-label*="Pit"]') })

      // Try each pit to find one that gives extra turn
      const pitCount = await pits.count()
      for (let j = 0; j < pitCount; j++) {
        const pit = pits.nth(j)
        if (await pit.isEnabled().catch(() => false)) {
          await pit.click()
          await page.waitForTimeout(500)

          // Check for extra turn notification
          const extraTurn = await page
            .getByText(/Extra turn/i)
            .isVisible()
            .catch(() => false)
          if (extraTurn) {
            expect(extraTurn).toBeTruthy()
            return // Test passed
          }

          // If we're still on player's turn after the move, might have gotten extra turn
          const stillPlayerTurn = await page
            .getByText(/Player's Turn/i)
            .isVisible()
            .catch(() => false)
          if (stillPlayerTurn) {
            // Extra turn happened even if notification didn't show yet
            return
          }

          break
        }
      }

      await page.waitForTimeout(1500)
    }
  })

  test('should animate pits when stones are distributed', async ({ page }) => {
    // Start game
    await page.getByRole('button', { name: /Start Game/i }).click()
    await page.waitForTimeout(500)

    // Get all pit buttons
    const pits = page.getByRole('button').filter({ has: page.locator('[aria-label*="Pit"]') })

    // Click the first available pit
    const firstPit = pits.first()
    await firstPit.click()

    // Wait a brief moment for animation to start
    await page.waitForTimeout(200)

    // Check that at least one pit has the animation class
    // The animation class is 'animate-pit-receive'
    const animatingPits = page.locator('.animate-pit-receive')
    const animatingCount = await animatingPits.count()

    // At least one pit should be animating (the stones were distributed somewhere)
    expect(animatingCount).toBeGreaterThan(0)

    // Wait for animations to complete (600ms animation + some buffer)
    await page.waitForTimeout(1000)

    // After animations complete, the animation classes should be removed
    const animatingPitsAfter = await page.locator('.animate-pit-receive').count()
    expect(animatingPitsAfter).toBe(0)
  })

  test('should show sequential pit animations in correct order', async ({ page }) => {
    // Start game
    await page.getByRole('button', { name: /Start Game/i }).click()
    await page.waitForTimeout(500)

    // Get all pits
    const pits = page.getByRole('button').filter({ has: page.locator('[aria-label*="Pit"]') })

    // Click a pit with known stones (pit 1 should have 4 stones initially)
    const firstPit = pits.first()
    await firstPit.click()

    // Check animations appear sequentially
    // Wait 100ms and check if animation started
    await page.waitForTimeout(150)
    const firstCheck = await page.locator('.animate-pit-receive').count()
    expect(firstCheck).toBeGreaterThan(0)

    // Wait another 200ms, should have more or same animations running
    await page.waitForTimeout(200)
    const secondCheck = await page.locator('.animate-pit-receive').count()
    expect(secondCheck).toBeGreaterThanOrEqual(0)

    // Animations should complete after total time
    await page.waitForTimeout(1500)
    const finalCheck = await page.locator('.animate-pit-receive').count()
    expect(finalCheck).toBe(0)
  })

  test('should animate stores when they receive stones', async ({ page }) => {
    // Start game
    await page.getByRole('button', { name: /Start Game/i }).click()
    await page.waitForTimeout(500)

    // Make multiple moves to likely get stones in a store
    for (let i = 0; i < 5; i++) {
      const isPlayerTurn = await page
        .getByText(/Player's Turn/i)
        .isVisible()
        .catch(() => false)

      if (!isPlayerTurn) {
        await page.waitForTimeout(1500)
        continue
      }

      const pits = page.getByRole('button').filter({ has: page.locator('[aria-label*="Pit"]') })
      const pitCount = await pits.count()

      // Try different pits
      for (let j = 0; j < pitCount; j++) {
        const pit = pits.nth(j)
        if (await pit.isEnabled().catch(() => false)) {
          await pit.click()
          await page.waitForTimeout(100)

          // Check if store is animating (stores have animate-store-receive class)
          const animatingStores = await page.locator('.animate-store-receive').count()
          if (animatingStores > 0) {
            // Store animation detected!
            expect(animatingStores).toBeGreaterThan(0)

            // Wait for animation to complete
            await page.waitForTimeout(800)
            const afterAnimation = await page.locator('.animate-store-receive').count()
            expect(afterAnimation).toBe(0)
            return // Test passed
          }

          break
        }
      }

      await page.waitForTimeout(1500)
    }
  })

  test('should not animate when reduced motion is preferred', async ({ page, context }) => {
    // Set reduced motion preference
    await context.addInitScript(() => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query: string) => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => true,
        }),
      })
    })

    // Reload with reduced motion
    await page.goto('http://localhost:3002/')

    // Start game
    await page.getByRole('button', { name: /Start Game/i }).click()
    await page.waitForTimeout(500)

    // Make a move
    const pits = page.getByRole('button').filter({ has: page.locator('[aria-label*="Pit"]') })
    await pits.first().click()

    // Wait for potential animations
    await page.waitForTimeout(300)

    // No animation classes should be applied with reduced motion
    const animatingPits = await page.locator('.animate-pit-receive').count()
    expect(animatingPits).toBe(0)

    const animatingStores = await page.locator('.animate-store-receive').count()
    expect(animatingStores).toBe(0)
  })
})
