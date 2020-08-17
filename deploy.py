#!/usr/bin/env python

import boto3
import argparse
from zygoat.utils.files import repository_root, use_dir
from zygoat.utils.shell import run
from zygoat.constants import Projects
from zygoat.utils.printing import log
from zygoat.config import Config

ECR_REPO_PREFIX = "818831340115.dkr.ecr.us-east-1.amazonaws.com"


def get_git_commit_hash():
    return (
        run(["git", "rev-parse", "--short", "HEAD"], capture_output=True)
        .stdout.decode()
        .strip()
    )


def main(args):
    config = Config()
    ecs = boto3.client("ecs")

    with repository_root():
        with use_dir(Projects.BACKEND):
            log.info(f"Updating {args.environment} backend")
            run(["zappa", "update", args.environment])

            log.info(f"Running migrations for {args.environment}")
            run(["zappa", "manage", args.environment, "migrate"])

        with use_dir(Projects.FRONTEND):
            log.info("Building frontend")
            image_name = f"{config.name}-frontend"
            latest = f"{image_name}:latest"
            git_commit_hash = get_git_commit_hash()
            tags = ["latest", f"{args.environment}", f"{git_commit_hash}"]

            run(
                [
                    "docker",
                    "build",
                    "-t",
                    f"{latest}",
                    "-t",
                    f"{image_name}:{args.environment}",
                    "-t",
                    f"{image_name}:{git_commit_hash}",
                    ".",
                ]
            )

            for tag in tags:
                run(
                    [
                        "docker",
                        "tag",
                        f"{image_name}:{tag}",
                        f"{ECR_REPO_PREFIX}/{image_name}:{tag}",
                    ]
                )
                run(["docker", "push", f"{ECR_REPO_PREFIX}/{image_name}:{tag}"])

            log.info(
                f"Updating service frontend-{args.environment} on {config.name} ECS cluster"
            )
            ecs.update_service(
                cluster=f"{config.name}",
                service=f"frontend-{args.environment}",
                taskDefinition=f"{config.name}-frontend-{args.environment}",
                forceNewDeployment=True,
            )


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("environment")
    main(parser.parse_args())
