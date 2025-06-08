# ver=24.1.0 or ver=latest
volta-install:
	volta install node@$(ver)

volta-pin:
	volta pin node@$(ver)
