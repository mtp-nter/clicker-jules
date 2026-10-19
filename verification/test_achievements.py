import os
import time
import subprocess
from playwright.sync_api import sync_playwright, expect

# Start HTTP server for local testing so document.cookie works properly
SERVER_PORT = 8080
URL = f"http://localhost:{SERVER_PORT}/index.html"

def test_app():
    server_process = subprocess.Popen(["python3", "-m", "http.server", str(SERVER_PORT)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1) # wait for server to start

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(
                record_video_dir="/home/jules/verification/videos"
            )
            page = context.new_page()

            try:
                print("1. Navigating to application...")
                page.goto(URL)
                page.wait_for_timeout(500)

                counter = page.locator("#counter")
                cookie = page.locator("#cookie")
                reset_btn = page.locator("#reset-btn")

                trophy_10 = page.locator("#trophy-10")
                trophy_100 = page.locator("#trophy-100")
                trophy_1000 = page.locator("#trophy-1000")

                # Check initial state
                print("2. Checking initial state...")
                expect(counter).to_have_text("0")
                expect(trophy_10).not_to_have_class("trophy-card unlocked")
                expect(trophy_100).not_to_have_class("trophy-card unlocked")
                expect(trophy_1000).not_to_have_class("trophy-card unlocked")

                # Click 10 times
                print("3. Clicking 10 times for Bronze Cookie trophy...")
                for _ in range(10):
                    cookie.click()
                    page.wait_for_timeout(50)

                expect(counter).to_have_text("10")
                expect(trophy_10).to_have_class("trophy-card unlocked")
                expect(trophy_100).not_to_have_class("trophy-card unlocked")
                expect(trophy_1000).not_to_have_class("trophy-card unlocked")
                page.wait_for_timeout(500)

                # Reach 100 clicks
                print("4. Reaching 100 clicks for Silver Cookie trophy...")
                page.evaluate("""() => {
                    for(let i = 0; i < 90; i++) {
                        document.getElementById('cookie').click();
                    }
                }""")
                expect(counter).to_have_text("100")
                expect(trophy_10).to_have_class("trophy-card unlocked")
                expect(trophy_100).to_have_class("trophy-card unlocked")
                expect(trophy_1000).not_to_have_class("trophy-card unlocked")
                page.wait_for_timeout(500)

                # Reach 1000 clicks
                print("5. Reaching 1000 clicks for Gold Cookie trophy...")
                page.evaluate("""() => {
                    for(let i = 0; i < 900; i++) {
                        document.getElementById('cookie').click();
                    }
                }""")
                expect(counter).to_have_text("1000")
                expect(trophy_10).to_have_class("trophy-card unlocked")
                expect(trophy_100).to_have_class("trophy-card unlocked")
                expect(trophy_1000).to_have_class("trophy-card unlocked")
                page.wait_for_timeout(500)

                # Verify reload persistence
                print("6. Verifying cookie persistence on reload...")
                page.reload()
                page.wait_for_timeout(500)
                expect(counter).to_have_text("1000")
                expect(trophy_10).to_have_class("trophy-card unlocked")
                expect(trophy_100).to_have_class("trophy-card unlocked")
                expect(trophy_1000).to_have_class("trophy-card unlocked")

                # Verify Reset button
                print("7. Testing Reset functionality...")
                reset_btn.click()
                page.wait_for_timeout(500)
                expect(counter).to_have_text("0")
                expect(trophy_10).not_to_have_class("trophy-card unlocked")
                expect(trophy_100).not_to_have_class("trophy-card unlocked")
                expect(trophy_1000).not_to_have_class("trophy-card unlocked")

                # Click 10 times again to show unlocked state in final screenshot
                print("8. Clicking 10 times again for final visual state...")
                for _ in range(10):
                    cookie.click()
                    page.wait_for_timeout(50)

                expect(counter).to_have_text("10")
                expect(trophy_10).to_have_class("trophy-card unlocked")

                page.screenshot(path="/home/jules/verification/screenshots/verification.png")
                page.wait_for_timeout(1000)
                print("All test cases passed successfully!")

            finally:
                context.close()
                browser.close()
    finally:
        server_process.terminate()

if __name__ == "__main__":
    test_app()
