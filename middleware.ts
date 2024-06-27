import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Auth } from "@auth/core";
import type { Session } from "@auth/core/types";
import type { JWT } from "@auth/core/jwt";
import type { AdapterUser } from "@auth/core/adapters";
import { getAuthConfig } from "@/lib/auth";

type AuthUser = {
	session: Session;
	token?: JWT;
	user?: AdapterUser;
};

export async function getServerSession(req: NextRequest) {
	const config = getAuthConfig();
	config.secret ??= process.env.AUTH_SECRET;
	config.basePath ??= "/api/auth";
	config.trustHost = true;
	const origin = req.nextUrl.origin;
	console.log({
		origin,
	});
	const request = new Request(`${origin}${config.basePath}/session`, {
		headers: { cookie: req.headers.get("cookie") ?? "" },
	});

	let authUser: AuthUser = {} as AuthUser;

	const response = (await Auth(request, {
		...config,
		callbacks: {
			...config.callbacks,
			async session(...args) {
				authUser = args[0];
				const session =
					(await config.callbacks?.session?.(...args)) ?? args[0].session;
				const user = args[0].user ?? args[0].token;
				return { user, ...session } satisfies Session;
			},
		},
	})) as Response;

	const session = (await response.json()) as Session | null;

	return session?.user ? authUser : null;
}

export async function middleware(request: NextRequest) {
	const session = await getServerSession(request);
	const { pathname } = request.nextUrl;

	if (pathname.startsWith("/api")) {
		return NextResponse.next();
	}

	if (session && pathname === "/") {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	if (
		!session &&
		pathname !== "/" &&
		pathname !== "/auth" &&
		pathname !== "/404"
	) {
		return NextResponse.redirect(new URL("/404", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
